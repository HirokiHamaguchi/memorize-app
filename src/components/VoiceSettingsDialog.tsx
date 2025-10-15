import {
    Button,
    VStack,
    Box,
    Text,
    useDisclosure
} from '@chakra-ui/react'
import { getEnglishVoices, getJapaneseVoices } from '../utils/speak'
import { BUTTON_STYLES } from './headerButton'

interface VoiceSettingsDialogProps {
    englishVoice?: SpeechSynthesisVoice
    japaneseVoice?: SpeechSynthesisVoice
    onEnglishVoiceChange: (voice: SpeechSynthesisVoice | undefined) => void
    onJapaneseVoiceChange: (voice: SpeechSynthesisVoice | undefined) => void
}

export const VoiceSettingsDialog = ({
    englishVoice,
    japaneseVoice,
    onEnglishVoiceChange,
    onJapaneseVoiceChange
}: VoiceSettingsDialogProps) => {
    const { open, onToggle } = useDisclosure()

    return (
        <Box position="relative">
            <Button
                backgroundColor="green.600"
                onClick={onToggle}
                {...BUTTON_STYLES}
            >
                設定
            </Button>
            {open && (
                <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    zIndex={10}
                    backgroundColor="white"
                    border="1px solid #ccc"
                    borderRadius="md"
                    boxShadow="lg"
                    p={4}
                    minWidth="300px"
                    mt={2}
                >
                    <VStack gap={4} width="100%">
                        <Box width="100%">
                            <Text fontSize="sm" mb={2}>英語音声</Text>
                            <select
                                value={englishVoice?.name || ''}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const selectedVoice = getEnglishVoices().find(v => v.name === e.target.value)
                                    onEnglishVoiceChange(selectedVoice)
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
                            <Text fontSize="sm" mb={2}>日本語音声</Text>
                            <select
                                value={japaneseVoice?.name || ''}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const selectedVoice = getJapaneseVoices().find(v => v.name === e.target.value)
                                    onJapaneseVoiceChange(selectedVoice)
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

                        <Button size="sm" onClick={onToggle} alignSelf="flex-end">
                            閉じる
                        </Button>
                    </VStack>
                </Box>
            )}
        </Box>
    )
}