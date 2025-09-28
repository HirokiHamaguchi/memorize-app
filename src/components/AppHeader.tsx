// src/components/AppHeader.tsx
import { Button, Text, Flex } from '@chakra-ui/react'

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
                size="md"
                onClick={onToggleFlip}
                transition="all 0.2s"
                _hover={{ transform: "scale(1.05)" }}
            >
                反転
            </Button>

            <Text
                fontSize="xl"
                fontWeight="bold"
            >
                英単語暗記アプリ
            </Text>

            <Button
                backgroundColor="blue.600"
                size="md"
                onClick={onNextPage}
                transition="all 0.2s"
                _hover={{ transform: "scale(1.05)" }}
            >
                次へ
            </Button>
        </Flex>
    )
}