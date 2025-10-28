import { useState, useRef, useCallback, useEffect } from 'react'
import { VOCABULARY_LISTEN_DATASETS } from '../config/constant'
import { speak, stopSpeech, sleep, cleanupSpeech } from '../utils/speak'
import type { Vocabulary } from '../types/type'
import { shuffleArray } from '../utils/shuffle'

interface UseListenDataProps {
    datasetId: string | undefined
    selectedSection: number | null
}

interface UseListenDataReturn {
    data: Vocabulary[]
    isLoading: boolean
    error: string | null
    datasetConfig: typeof VOCABULARY_LISTEN_DATASETS[0] | undefined
}

export const useListenData = ({ datasetId, selectedSection }: UseListenDataProps): UseListenDataReturn => {
    const [data, setData] = useState<Vocabulary[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // データセット設定を取得
    const datasetConfig = VOCABULARY_LISTEN_DATASETS.find(d => d.id === datasetId)

    // データを読み込む
    const loadData = useCallback(async () => {
        // セクションが選択されていない場合はデータを読み込まない
        if (selectedSection === null) {
            setData([])
            return
        }

        if (!datasetConfig) {
            setError('データセットが見つかりません')
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            // セクション番号を指定してデータを読み込む
            const rawData = await datasetConfig.dataLoader(selectedSection)
            const processedData = datasetConfig.processor(rawData.default) as Vocabulary[]
            setData(shuffleArray(processedData))
            setError(null)
        } catch (err) {
            setError('データの読み込みに失敗しました')
            console.error('データ読み込みエラー:', err)
        } finally {
            setIsLoading(false)
        }
    }, [datasetConfig, selectedSection])

    // セクション選択時にデータを読み込む
    useEffect(() => {
        loadData()
    }, [loadData])

    return {
        data,
        isLoading,
        error,
        datasetConfig
    }
}

interface UseListenPlayerProps {
    data: Vocabulary[]
    rate: number
    englishVoice?: SpeechSynthesisVoice
    japaneseVoice?: SpeechSynthesisVoice
}

interface UseListenPlayerReturn {
    isPlaying: boolean
    currentIndex: number
    togglePlay: () => void
    goToPrevious: () => void
    goToNext: () => void
}

export const useListenPlayer = ({ data, rate, englishVoice, japaneseVoice }: UseListenPlayerProps): UseListenPlayerReturn => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const abortControllerRef = useRef<AbortController | null>(null)

    // 中断チェック用のヘルパー関数
    const checkAborted = useCallback((): boolean => {
        return abortControllerRef.current?.signal.aborted ?? false
    }, [])

    // 単語ペアを読み上げる
    const speakWordPair = useCallback(async (item: Vocabulary): Promise<void> => {
        await speak(item.en, 'en-US', { rate, voice: englishVoice })
        if (checkAborted()) return
        await sleep(100)
        if (checkAborted()) return
        await speak(item.ja, 'ja-JP', { rate, voice: japaneseVoice })
        if (checkAborted()) return
        await sleep(200)
    }, [rate, englishVoice, japaneseVoice, checkAborted])

    // 再生処理の共通関数
    const startPlayingFrom = useCallback(async (startIndex: number, changeIsPlaying: boolean) => {
        if (data.length === 0) return

        if (changeIsPlaying) setIsPlaying(true)
        abortControllerRef.current = new AbortController()

        try {
            for (let i = startIndex; i < data.length; i++) {
                if (checkAborted()) break
                setCurrentIndex(i)
                await speakWordPair(data[i])
                if (checkAborted()) break
            }

            // 全て完了した場合
            if (!checkAborted()) {
                setCurrentIndex(0) // インデックスをリセット
                if (changeIsPlaying) setIsPlaying(false)
            }
        } catch (err) {
            console.error('読み上げエラー:', err)
        }
    }, [data, speakWordPair, checkAborted])

    // 再生停止処理の共通関数
    const stopPlaying = useCallback((changeIsPlaying: boolean) => {
        if (abortControllerRef.current) abortControllerRef.current.abort()
        stopSpeech()
        if (changeIsPlaying) setIsPlaying(false)
    }, [])

    // 読み上げを開始/停止する
    const togglePlay = useCallback(async () => {
        if (isPlaying) stopPlaying(true)
        else await startPlayingFrom(currentIndex, true)
    }, [isPlaying, currentIndex, stopPlaying, startPlayingFrom])

    // 前の単語に移動
    const goToPrevious = useCallback(() => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1
            const wasPlaying = isPlaying
            if (wasPlaying) stopPlaying(false)
            setCurrentIndex(newIndex)
            if (wasPlaying) setTimeout(() => {
                startPlayingFrom(newIndex, false)
            }, 50);
        }
    }, [currentIndex, isPlaying, stopPlaying, startPlayingFrom])

    // 次の単語に移動
    const goToNext = useCallback(() => {
        if (currentIndex < data.length - 1) {
            const newIndex = currentIndex + 1
            const wasPlaying = isPlaying
            if (wasPlaying) stopPlaying(false)
            setCurrentIndex(newIndex)
            if (wasPlaying) setTimeout(() => {
                startPlayingFrom(newIndex, false)
            }, 50);
        }
    }, [currentIndex, isPlaying, data.length, stopPlaying, startPlayingFrom])

    // コンポーネントのアンマウント時にクリーンアップ
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            cleanupSpeech()
        }
    }, [])

    return {
        isPlaying,
        currentIndex,
        togglePlay,
        goToPrevious,
        goToNext
    }
}