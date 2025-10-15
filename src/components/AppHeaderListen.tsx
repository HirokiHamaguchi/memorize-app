import { Flex, Button, VStack } from '@chakra-ui/react'
import { AppInfoDialog } from './dialog'
import { VoiceSettingsDialog } from './VoiceSettingsDialog'
import { BUTTON_STYLES } from './headerButton'

interface AppHeaderListenProps {
    rate: number
    englishVoice?: SpeechSynthesisVoice
    japaneseVoice?: SpeechSynthesisVoice
    onRateChange: (rate: number) => void
    onEnglishVoiceChange: (voice: SpeechSynthesisVoice | undefined) => void
    onJapaneseVoiceChange: (voice: SpeechSynthesisVoice | undefined) => void
}

/**
 * リスニング用のアプリケーションヘッダーコンポーネント
 */
export const AppHeaderListen = ({
    rate,
    englishVoice,
    japaneseVoice,
    onRateChange,
    onEnglishVoiceChange,
    onJapaneseVoiceChange
}: AppHeaderListenProps) => {
    return (
        <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="center"
        >
            {/* 左側: 音声設定ボタン */}
            <VoiceSettingsDialog
                englishVoice={englishVoice}
                japaneseVoice={japaneseVoice}
                onEnglishVoiceChange={onEnglishVoiceChange}
                onJapaneseVoiceChange={onJapaneseVoiceChange}
            />

            {/* 中央: AppInfoDialog */}
            <AppInfoDialog textArgs={{ fontSize: "xl", fontWeight: "bold" }} />

            {/* 右側: 速度調整セレクト */}
            <VStack gap={1} alignItems="flex-end">
                <Button
                    backgroundColor="blue.600"
                    onClick={() => {
                        const rates = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 2.0];
                        const currentIdx = rates.indexOf(rate);
                        const nextIdx = (currentIdx + 1) % rates.length;
                        onRateChange(rates[nextIdx]);
                    }}
                    {...BUTTON_STYLES}
                >
                    {rate.toFixed(1)}
                </Button>
            </VStack>
        </Flex>
    )
}