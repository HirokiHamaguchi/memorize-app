import { Box, Button, Text, Flex } from '@chakra-ui/react'

export interface DatasetOption {
    id: string
    name: string
    description: string
    count: number
}

interface DatasetSelectorProps {
    datasets: DatasetOption[]
    onSelect: (datasetId: string) => void
}

export const DatasetSelector = ({ datasets, onSelect }: DatasetSelectorProps) => {
    return (
        <Box
            height="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.50"
            p={4}
        >
            <Box maxW="600px" w="full">
                <Box mb={8} textAlign="center">
                    <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={4}>
                        語彙学習アプリ
                    </Text>
                    <Text fontSize="lg" color="gray.600">
                        学習したい語彙データセットを選択してください
                    </Text>
                </Box>

                <Box>
                    {datasets.map((dataset) => (
                        <Box
                            key={dataset.id}
                            w="full"
                            mb={4}
                            p={6}
                            bg="white"
                            borderRadius="md"
                            boxShadow="md"
                            cursor="pointer"
                            _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                        >
                            <Flex justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Text fontSize="xl" fontWeight="semibold" mb={1}>
                                        {dataset.name}
                                    </Text>
                                    <Text color="gray.600" fontSize="md" mb={1}>
                                        {dataset.description}
                                    </Text>
                                    <Text color="blue.500" fontSize="sm">
                                        {dataset.count.toLocaleString()}語収録
                                    </Text>
                                </Box>
                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    onClick={() => onSelect(dataset.id)}
                                >
                                    選択
                                </Button>
                            </Flex>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}