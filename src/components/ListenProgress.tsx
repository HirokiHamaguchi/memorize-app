import { Box, Text } from '@chakra-ui/react'
import type { Vocabulary } from '../types/type'

interface ListenProgressProps {
    currentIndex: number
    totalCount: number
    currentItem: Vocabulary | undefined
}

export const ListenProgress = ({
    currentIndex,
    totalCount,
    currentItem
}: ListenProgressProps) => {
    return (
        <Box bg="white" borderRadius="lg" p={6} shadow="sm">
            {totalCount > 0 && (
                <Box textAlign="center">
                    <Text fontSize="lg" mb={2}>
                        進捗: {currentIndex + 1} / {totalCount}
                    </Text>
                    {currentItem && (
                        <Box p={4}
                            bg="gray.50"
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => {
                                window.open(`https://ejje.weblio.jp/content/${currentItem.en}`, '_blank')
                            }}
                        >
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                {currentItem.en}
                            </Text>
                            <Text fontSize="lg" color="gray.600">
                                {currentItem.ja}
                            </Text>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    )
}