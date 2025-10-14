import { Flex, Button, Text, VStack, Box } from '@chakra-ui/react'
import { Slider } from "@chakra-ui/react"
import { AppInfoDialog } from './dialog'

interface AppHeaderListenProps {
    isPlaying: boolean
    rate: number
    onTogglePlay: () => void
    onRateChange: (rate: number) => void
}

/**
 * リスニング用のアプリケーションヘッダーコンポーネント
 */
export const AppHeaderListen = ({ isPlaying, rate, onTogglePlay, onRateChange }: AppHeaderListenProps) => {
    return (
        <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
        >
            {/* 左側: 再生/停止ボタン */}
            <Button
                backgroundColor={isPlaying ? "red.600" : "green.600"}
                color="white"
                size="md"
                transition="all 0.2s"
                _hover={{ transform: "scale(1.05)" }}
                onClick={onTogglePlay}
                minWidth="80px"
            >
                {isPlaying ? "停止" : "再生"}
            </Button>

            {/* 中央: 速度調整スライダー */}
            <VStack gap={1} flex={1} maxWidth="200px">
                <Text fontSize="sm" color="gray.600">
                    速度: {rate.toFixed(1)}x
                </Text>
                <Box width="100%">
                    <Slider.Root
                        value={[rate]}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        onValueChange={(details: { value: number[] }) => onRateChange(details.value[0])}
                    >
                        <Slider.Track>
                            <Slider.Range />
                        </Slider.Track>
                        <Slider.Thumb index={0} />
                    </Slider.Root>
                </Box>
            </VStack>

            {/* 右側: 情報ダイアログ */}
            <AppInfoDialog textArgs={{}} />
        </Flex>
    )
}