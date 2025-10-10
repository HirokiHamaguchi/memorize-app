import { Box, Text } from '@chakra-ui/react'
import { AppInfoDialog } from '../components/dialog'
import { SELECT_HEADER_HEIGHT } from '../config/constant'

export const MemoPage = () => {
    const availableHeight = window.innerHeight - SELECT_HEADER_HEIGHT - 50;

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
                        Memo Page
                    </Text>
                </Box>
                <Box>
                    <iframe
                        src="https://best-limburger-6ae.notion.site/ebd/2884ad7c2a78802faf78c493915b99a8"
                        width="100%"
                        height={availableHeight}
                    />
                </Box>
            </Box>
        </Box >
    )
}