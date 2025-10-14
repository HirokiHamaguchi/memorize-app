import { Box, Heading, Text } from '@chakra-ui/react'
import type { Vocabulary } from '../types/type'

interface ListenProgressProps {
    datasetName: string
    datasetDescription: string
    currentIndex: number
    totalCount: number
    currentItem: Vocabulary | undefined
}

export const ListenProgress = ({
    datasetName,
    datasetDescription,
    currentIndex,
    totalCount,
    currentItem
}: ListenProgressProps) => {
    return (
        <Box bg="white" borderRadius="lg" p={6} shadow="sm">
            <Heading size="lg" mb={4} textAlign="center">
                {datasetName}
            </Heading>

            <Text textAlign="center" mb={6} color="gray.600">
                {datasetDescription}
            </Text>

            {totalCount > 0 && (
                <Box textAlign="center">
                    <Text fontSize="lg" mb={2}>
                        進捗: {currentIndex + 1} / {totalCount}
                    </Text>

                    {currentItem && (
                        <Box p={4} bg="gray.50" borderRadius="md">
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