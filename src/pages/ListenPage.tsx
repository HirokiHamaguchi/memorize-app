import { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Container, Heading, Text, Center } from '@chakra-ui/react'
import { AppHeaderListen } from '../components/AppHeaderListen'
import { VOCABULARY_DATASETS } from '../config/constant'
import { speak, stopSpeech, sleep } from '../utils/speak'
import type { Vocabulary } from '../types/type'

export const ListenPage = ({ datasetId }: { datasetId: string }) => {
    const [data, setData] = useState<Vocabulary[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [rate, setRate] = useState(1.0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    // データセット設定を取得
    const datasetConfig = VOCABULARY_DATASETS.find(d => d.id === datasetId)

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
                // 中断チェック
                if (abortControllerRef.current?.signal.aborted) break

                const item = data[i]
                setCurrentIndex(i)

                // 英語を読み上げ
                await speak(item.en, 'en-US', { rate })

                // 中断チェック
                if (abortControllerRef.current?.signal.aborted) break

                // 間隔を空ける
                await sleep(200)

                // 中断チェック
                if (abortControllerRef.current?.signal.aborted) break

                // 日本語を読み上げ
                await speak(item.ja, 'ja-JP', { rate })

                // 中断チェック
                if (abortControllerRef.current?.signal.aborted) break

                // 次のペアまでの間隔
                await sleep(500)
            }

            // 全て完了した場合
            if (!abortControllerRef.current?.signal.aborted) {
                setCurrentIndex(0) // インデックスをリセット
            }
        } catch (err) {
            console.error('読み上げエラー:', err)
        } finally {
            setIsPlaying(false)
        }
    }, [isPlaying, data, currentIndex, rate])

    // 速度変更ハンドラー
    const handleRateChange = useCallback((newRate: number) => {
        setRate(newRate)
    }, [])

    if (isLoading) {
        return (
            <Center height="100vh">
                <Text>データを読み込み中...</Text>
            </Center>
        )
    }

    if (error) {
        return (
            <Center height="100vh">
                <Text color="red.500">{error}</Text>
            </Center>
        )
    }

    if (!datasetConfig) {
        return (
            <Center height="100vh">
                <Text color="red.500">データセットが見つかりません</Text>
            </Center>
        )
    }

    return (
        <Box minHeight="100vh" bg="gray.50">
            <Container maxWidth="container.lg" py={4}>
                {/* ヘッダー */}
                <Box mb={6}>
                    <AppHeaderListen
                        isPlaying={isPlaying}
                        rate={rate}
                        onTogglePlay={togglePlay}
                        onRateChange={handleRateChange}
                    />
                </Box>

                {/* メインコンテンツ */}
                <Box bg="white" borderRadius="lg" p={6} shadow="sm">
                    <Heading size="lg" mb={4} textAlign="center">
                        {datasetConfig.name}
                    </Heading>

                    <Text textAlign="center" mb={6} color="gray.600">
                        {datasetConfig.description}
                    </Text>

                    {data.length > 0 && (
                        <Box textAlign="center">
                            <Text fontSize="lg" mb={2}>
                                進捗: {currentIndex + 1} / {data.length}
                            </Text>

                            {currentIndex < data.length && (
                                <Box p={4} bg="gray.50" borderRadius="md">
                                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                                        {data[currentIndex].en}
                                    </Text>
                                    <Text fontSize="lg" color="gray.600">
                                        {data[currentIndex].ja}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    )
}