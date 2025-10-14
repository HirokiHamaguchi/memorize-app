import { Flex, Button, VStack, Text } from '@chakra-ui/react'
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react"
import { AppInfoDialog } from './dialog'

// 定数定義（AppHeaderと統一）
const BUTTON_STYLES = {
    size: "md" as const,
    transition: "all 0.2s",
    _hover: { transform: "scale(1.05)" }
}

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
        >
            {/* 左側: 再生/停止ボタン */}
            <Button
                backgroundColor={isPlaying ? "red.600" : "green.600"}
                onClick={onTogglePlay}
                {...BUTTON_STYLES}
            >
                {isPlaying ? "停止" : "再生"}
            </Button>

            {/* 中央: AppInfoDialog */}
            <AppInfoDialog textArgs={{ fontSize: "xl", fontWeight: "bold" }} />

            {/* 右側: 速度調整セレクト */}
            <VStack gap={1} alignItems="flex-end">
                <Text fontSize="sm" color="gray.600">
                    速度: {rate.toFixed(1)}x
                </Text>
                {/* <NativeSelectRoot size="sm" width="100px">
                    <NativeSelectField
                        value={rate}
                        onChange={(e) => onRateChange(parseFloat(e.target.value))}
                    >
                        <option value={0.5}>0.5x</option>
                        <option value={0.7}>0.7x</option>
                        <option value={1.0}>1.0x</option>
                        <option value={1.2}>1.2x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2.0}>2.0x</option>
                    </NativeSelectField>
                </NativeSelectRoot> */}
            </VStack>
        </Flex>
    )
}