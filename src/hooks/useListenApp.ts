import { useState, useRef, useCallback, useEffect } from 'react'
import { VOCABULARY_DATASETS } from '../config/constant'
import { speak, stopSpeech, sleep } from '../utils/speak'
import type { Vocabulary } from '../types/type'

interface UseListenDataProps {
    datasetId: string | undefined
}

interface UseListenDataReturn {
    data: Vocabulary[]
    isLoading: boolean
    error: string | null
    datasetConfig: typeof VOCABULARY_DATASETS[0] | undefined
}

export const useListenData = ({ datasetId }: UseListenDataProps): UseListenDataReturn => {
    const [data, setData] = useState<Vocabulary[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // データセット設定を取得
    const datasetConfig = VOCABULARY_DATASETS.find(d => d.id === "listen_" + datasetId)

    // データを読み込む
    const loadData = useCallback(async () => {
        if (!datasetConfig) {
            setError('データセットが見つかりません')
            setIsLoading(false)
            return
        }

        try {
            const rawData = await datasetConfig.dataLoader()
            const processedData = datasetConfig.processor(rawData.default) as Vocabulary[]
            setData(processedData)
            setError(null)
        } catch (err) {
            setError('データの読み込みに失敗しました')
            console.error('データ読み込みエラー:', err)
        } finally {
            setIsLoading(false)
        }
    }, [datasetConfig])

    // コンポーネントマウント時にデータを読み込む
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
}

interface UseListenPlayerReturn {
    isPlaying: boolean
    currentIndex: number
    togglePlay: () => void
}

export const useListenPlayer = ({ data, rate }: UseListenPlayerProps): UseListenPlayerReturn => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const abortControllerRef = useRef<AbortController | null>(null)

    // 中断チェック用のヘルパー関数
    const checkAborted = useCallback((): boolean => {
        return abortControllerRef.current?.signal.aborted ?? false
    }, [])

    // 単語ペアを読み上げる
    const speakWordPair = useCallback(async (item: Vocabulary): Promise<void> => {
        // 英語を読み上げ
        await speak(item.en, 'en-US', { rate })
        if (checkAborted()) return

        // 間隔を空ける
        await sleep(100)
        if (checkAborted()) return

        // 日本語を読み上げ
        await speak(item.ja, 'ja-JP', { rate })
        if (checkAborted()) return

        // 次のペアまでの間隔
        await sleep(200)
    }, [rate, checkAborted])

    // 読み上げを開始/停止する
    const togglePlay = useCallback(async () => {
        if (isPlaying) {
            // 停止
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            stopSpeech()
            setIsPlaying(false)
            return
        }

        // 開始
        if (data.length === 0) return

        setIsPlaying(true)
        abortControllerRef.current = new AbortController()

        try {
            for (let i = currentIndex; i < data.length; i++) {
                if (checkAborted()) break

                setCurrentIndex(i)
                await speakWordPair(data[i])

                if (checkAborted()) break
            }

            // 全て完了した場合
            if (!checkAborted()) {
                setCurrentIndex(0) // インデックスをリセット
            }
        } catch (err) {
            console.error('読み上げエラー:', err)
        } finally {
            setIsPlaying(false)
        }
    }, [isPlaying, data, currentIndex, speakWordPair, checkAborted])

    return {
        isPlaying,
        currentIndex,
        togglePlay
    }
}