import { Box, Text } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { AppInfoDialog } from '../components/dialog'
import { SELECT_HEADER_HEIGHT } from '../config/constant'

interface MemoConfig {
    title: string
    src: string
}

const MEMO_CONFIGS: Record<string, MemoConfig> = {
    geography: {
        title: '地理学習メモ',
        src: 'https://best-limburger-6ae.notion.site/ebd/2884ad7c2a78802faf78c493915b99a8'
    },
    vocabulary: {
        title: '語彙学習メモ',
        src: 'https://best-limburger-6ae.notion.site/ebd/2884ad7c2a78802faf78c493915b99a8' // 暫定的に同じURL
    }
}

export const MemoPage = () => {
    const location = useLocation()
    const availableHeight = window.innerHeight - SELECT_HEADER_HEIGHT - 50

    // URLパスから学習タイプを取得
    const studyType = location.pathname.includes('/geography/') ? 'geography' : 'vocabulary'
    const memoConfig = MEMO_CONFIGS[studyType] || MEMO_CONFIGS.geography

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
                        {memoConfig.title}
                    </Text>
                </Box>
                <Box>
                    <iframe
                        src={memoConfig.src}
                        width="100%"
                        height={availableHeight}
                    />
                </Box>
            </Box>
        </Box >
    )
}