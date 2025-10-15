import { Flex } from '@chakra-ui/react'
import { Button } from "@chakra-ui/react"
import { AppInfoDialog } from './dialog'
import { BUTTON_STYLES } from './headerButton'

// 定数定義
interface AppHeaderProps {
    isFlipped: boolean
    onToggleFlip: () => void
    onNextPage: () => void
}

/**
 * アプリケーションのヘッダーコンポーネント
 */
export const AppHeader = ({ isFlipped, onToggleFlip, onNextPage }: AppHeaderProps) => {
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

            <AppInfoDialog textArgs={{ fontSize: "xl", fontWeight: "bold" }} />

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