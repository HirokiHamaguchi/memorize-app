import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Box, VStack, Text, Center, HStack, IconButton } from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { AppHeaderListen, ListenProgress } from '../components'
import { useListenData, useListenPlayer } from '../hooks'

export const ListenPage = () => {
    const { datasetId } = useParams<{ datasetId: string }>()
    const [rate, setRate] = useState(1.5)

    // データの読み込み
    const { data, isLoading, error, datasetConfig } = useListenData({ datasetId })

    // 音声再生の制御
    const { isPlaying, currentIndex, togglePlay, goToPrevious, goToNext } = useListenPlayer({ data, rate })

    // 速度変更ハンドラー
    const handleRateChange = useCallback((newRate: number) => {
        setRate(newRate)
    }, [])

    if (isLoading || error || !datasetConfig) {
        const message = error
            ? error
            : !datasetConfig
                ? "データセットが見つかりません"
                : "データを読み込み中...";
        return (
            <Center height="100vh">
                <Text color="red.500">{message}</Text>
            </Center>
        );
    }
    return (
        <Box className="app-container">
            <VStack height="100%">
                <AppHeaderListen
                    isPlaying={isPlaying}
                    rate={rate}
                    onTogglePlay={togglePlay}
                    onRateChange={handleRateChange}
                />

                <ListenProgress
                    currentIndex={currentIndex}
                    totalCount={data.length}
                    currentItem={currentIndex < data.length ? data[currentIndex] : undefined}
                />

                <HStack gap={4} mt={4}>
                    <IconButton
                        aria-label="前の単語"
                        onClick={goToPrevious}
                        disabled={currentIndex <= 0}
                        colorScheme="blue"
                        variant="outline"
                    >
                        <FaChevronLeft />
                    </IconButton>
                    <IconButton
                        aria-label="次の単語"
                        onClick={goToNext}
                        disabled={currentIndex >= data.length - 1}
                        colorScheme="blue"
                        variant="outline"
                    >
                        <FaChevronRight />
                    </IconButton>
                </HStack>
            </VStack>
        </Box>
    )
}