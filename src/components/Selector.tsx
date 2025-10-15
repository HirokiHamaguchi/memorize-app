import { Box, Text, Flex } from '@chakra-ui/react'
import { AppInfoDialog } from './dialog'

export interface SelectorOption {
    id: string
    name: string
    description: string
}

interface SelectorProps {
    subtitle: string
    options: SelectorOption[]
    onSelect: (optionId: string) => void
}

export const Selector = ({
    subtitle,
    options,
    onSelect
}: SelectorProps) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
            py={8}
        >
            <Box maxW="600px" w="full">
                <Box mb={8} textAlign="center">
                    <AppInfoDialog
                        textArgs={{ fontSize: "3xl", fontWeight: "bold", color: "gray.800", mb: 4 }}
                    />
                    <Text fontSize="lg" color="gray.600">
                        {subtitle}
                    </Text>
                </Box>

                <Box>
                    {options.map((option) => (
                        <Box
                            key={option.id}
                            w="full"
                            mb={4}
                            p={6}
                            bg="white"
                            borderRadius="md"
                            boxShadow="md"
                            cursor="pointer"
                            _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                            onClick={() => onSelect(option.id)}
                        >
                            <Flex justifyContent="space-between" alignItems="center">
                                <Box flex="1">
                                    <Text fontSize="xl" fontWeight="semibold" mb={1}>
                                        {option.name}
                                    </Text>
                                    <Text color="gray.600" fontSize="md" mb={1}>
                                        {option.description}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}