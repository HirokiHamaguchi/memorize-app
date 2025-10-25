import { Box, Text, VStack } from '@chakra-ui/react'

// 定数
const SECTIONS_COUNT = 50

// Props型定義
interface SectionSelectorProps {
    selectedSection: number | null
    onSectionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    title?: string
    subtitle?: string
}

export const SectionSelector = ({
    selectedSection,
    onSectionChange,
    title = "学習する区分を選択してください",
    subtitle = `1〜${SECTIONS_COUNT}の区分から選択してください`
}: SectionSelectorProps) => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
        py={8}
        minHeight="100vh"
    >
        <VStack gap={4} maxW="400px" w="full">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
                {title}
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
                {subtitle}
            </Text>
            <select
                value={selectedSection || ''}
                onChange={onSectionChange}
                style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: '2px solid #E2E8F0',
                    width: '100%'
                }}
            >
                <option value="">区分を選択</option>
                {Array.from({ length: SECTIONS_COUNT }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                        区分 {num}
                    </option>
                ))}
            </select>
        </VStack>
    </Box>
)