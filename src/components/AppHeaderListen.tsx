import { Flex, Button, VStack } from '@chakra-ui/react'
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
                <Button
                    backgroundColor="blue.600"
                    onClick={() => {
                        const rates = [0.5, 0.7, 1.0, 1.2, 1.5, 2.0];
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