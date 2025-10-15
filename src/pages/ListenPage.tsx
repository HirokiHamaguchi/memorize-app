import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, VStack, Text, Center, HStack, IconButton } from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight, FaPlay, FaStop } from 'react-icons/fa'
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
                // en-USがあれば、その中から選ぶ。en-USの中にSamanthaがあれば、それを選ぶ
                const enUSVoices = enVoices.filter(v => v.lang === 'en-US')
                const samanthaVoice = enUSVoices.find(v => v.name.includes('Samantha'))
                if (samanthaVoice) {
                    setEnglishVoice(samanthaVoice)
                } else if (enUSVoices.length > 0) {
                    setEnglishVoice(enUSVoices[0])
                } else {
                    setEnglishVoice(enVoices[0])
                }
            }
            if (jaVoices.length > 0 && !japaneseVoice) {
                // ja-JPがあれば、その中から選ぶ。ja-JPの中にKyotoがあれば、それを選ぶ
                const jaJPVoices = jaVoices.filter(v => v.lang === 'ja-JP')
                const kyotoVoice = jaJPVoices.find(v => v.name.includes('Kyoto'))
                if (kyotoVoice) {
                    setJapaneseVoice(kyotoVoice)
                } else if (jaJPVoices.length > 0) {
                    setJapaneseVoice(jaJPVoices[0])
                } else {
                    setJapaneseVoice(jaVoices[0])
                }
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

    // 音声変更ハンドラー
    const handleEnglishVoiceChange = useCallback((voice: SpeechSynthesisVoice | undefined) => {
        setEnglishVoice(voice)
    }, [])

    const handleJapaneseVoiceChange = useCallback((voice: SpeechSynthesisVoice | undefined) => {
        setJapaneseVoice(voice)
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
                    rate={rate}
                    englishVoice={englishVoice}
                    japaneseVoice={japaneseVoice}
                    onRateChange={handleRateChange}
                    onEnglishVoiceChange={handleEnglishVoiceChange}
                    onJapaneseVoiceChange={handleJapaneseVoiceChange}
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
                        onClick={goToPrevious}
                        size="lg"
                        disabled={currentIndex <= 0}
                    >
                        <FaChevronLeft />
                    </IconButton>

                    {/* 再生/停止ボタン */}
                    <IconButton
                        onClick={togglePlay}
                        size="lg"
                        _hover={{ transform: "scale(1.05)" }}
                    >
                        {isPlaying ? <FaStop /> : <FaPlay />}
                    </IconButton>

                    <IconButton
                        onClick={goToNext}
                        size="lg"
                        disabled={currentIndex >= data.length - 1}
                    >
                        <FaChevronRight />
                    </IconButton>
                </HStack>
            </VStack>
        </Box>
    )
}