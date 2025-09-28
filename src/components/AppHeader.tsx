import { Flex } from '@chakra-ui/react'
import { Button } from "@chakra-ui/react"
import { AppInfoDialog } from './dialog'

// 定数定義
const BUTTON_STYLES = {
    size: "md" as const,
    transition: "all 0.2s",
    _hover: { transform: "scale(1.05)" }
}

interface AppHeaderProps {
    isFlipped: boolean
    onToggleFlip: () => void
    onNextPage: () => void
    onBack: () => void
}

/**
 * アプリケーションのヘッダーコンポーネント
 */
export const AppHeader = ({ isFlipped, onToggleFlip, onNextPage, onBack }: AppHeaderProps) => {
    return (
        <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            flexDirection={isFlipped ? "row-reverse" : "row"}
        >
            <Button
                backgroundColor="green.600"
                onClick={onToggleFlip}
                {...BUTTON_STYLES}
            >
                反転
            </Button>

            <AppInfoDialog textArgs={{ fontSize: "xl", fontWeight: "bold" }} onBack={onBack} />

            <Button
                backgroundColor="blue.600"
                onClick={onNextPage}
                {...BUTTON_STYLES}
            >
                次へ
            </Button>
        </Flex>
    )
}