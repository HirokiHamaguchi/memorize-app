import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, VStack, Text, Center, HStack, IconButton } from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { AppHeaderListen, ListenProgress } from '../components'
import { useListenData, useListenPlayer } from '../hooks'
import { getEnglishVoices, getJapaneseVoices } from '../utils/speak'

export const ListenPage = () => {
    const { datasetId } = useParams<{ datasetId: string }>()
    const [rate, setRate] = useState(1.0)
    const [englishVoice, setEnglishVoice] = useState<SpeechSynthesisVoice | undefined>()
    const [japaneseVoice, setJapaneseVoice] = useState<SpeechSynthesisVoice | undefined>()

    // 利用可能な音声を取得
    useEffect(() => {
        const loadVoices = () => {
            // デフォルトの音声を設定
            const enVoices = getEnglishVoices()
            const jaVoices = getJapaneseVoices()

            if (enVoices.length > 0 && !englishVoice) {
                setEnglishVoice(enVoices[0])
            }
            if (jaVoices.length > 0 && !japaneseVoice) {
                setJapaneseVoice(jaVoices[0])
            }
        }

        // 音声が読み込まれるまで待機
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = loadVoices
        } else {
            loadVoices()
        }

        return () => {
            speechSynthesis.onvoiceschanged = null
        }
    }, [englishVoice, japaneseVoice])

    // データの読み込み
    const { data, isLoading, error, datasetConfig } = useListenData({ datasetId })

    // 音声再生の制御
    const { isPlaying, currentIndex, togglePlay, goToPrevious, goToNext } = useListenPlayer({
        data,
        rate,
        englishVoice,
        japaneseVoice
    })

    // 速度変更ハンドラー
    const handleRateChange = useCallback((newRate: number) => {
        setRate(newRate)
    }, [])

    if (error || !datasetConfig) {
        const message = error ? error : "データセットが見つかりません";
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

                {isLoading ? (
                    <Center flex={1}>
                        <Text>Loading...</Text>
                    </Center>
                ) : (
                    <ListenProgress
                        currentIndex={currentIndex}
                        totalCount={data.length}
                        currentItem={currentIndex < data.length ? data[currentIndex] : undefined}
                    />)
                }

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

                <VStack gap={3} mt={4} width="100%" maxWidth="400px">
                    <Box width="100%">
                        <Text fontSize="sm" mb={1}>英語音声</Text>
                        <select
                            value={englishVoice?.name || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedVoice = getEnglishVoices().find(v => v.name === e.target.value)
                                setEnglishVoice(selectedVoice)
                            }}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="">英語音声を選択</option>
                            {getEnglishVoices().map((voice) => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </Box>

                    <Box width="100%">
                        <Text fontSize="sm" mb={1}>日本語音声</Text>
                        <select
                            value={japaneseVoice?.name || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedVoice = getJapaneseVoices().find(v => v.name === e.target.value)
                                setJapaneseVoice(selectedVoice)
                            }}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="">日本語音声を選択</option>
                            {getJapaneseVoices().map((voice) => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </Box>
                </VStack>
            </VStack>
        </Box>
    )
}