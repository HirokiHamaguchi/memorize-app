import { Box, Button, Text, Spinner, Stack } from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../hooks/useAuth'

export const LoginSection = () => {
    const { user, loading, signInWithGoogle, logout } = useAuth()

    if (loading) {
        return (
            <Box textAlign="center" py={8}>
                <Spinner size="lg" />
                <Text mt={4} color="gray.600">認証状態を確認中...</Text>
            </Box>
        )
    }

    if (user) {
        return (
            <Box
                bg="white"
                p={6}
                borderRadius="md"
                boxShadow="md"
                textAlign="center"
                maxW="400px"
                mx="auto"
            >
                <Stack gap={4}>
                    <Box
                        w="64px"
                        h="64px"
                        borderRadius="full"
                        bg="gray.300"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mx="auto"
                        backgroundImage={user.photoURL ? `url('${user.photoURL}')` : undefined}
                        backgroundSize="cover"
                        backgroundPosition="center"
                    >
                        {!user.photoURL && (
                            <Text fontSize="xl" fontWeight="bold" color="white">
                                {(user.displayName || 'U').charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </Box>
                    <Box>
                        <Text fontSize="lg" fontWeight="semibold">
                            {user.displayName || '匿名ユーザー'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            {user.email}
                        </Text>
                    </Box>
                    <Button
                        onClick={logout}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                    >
                        ログアウト
                    </Button>
                </Stack>
            </Box>
        )
    }

    return (
        <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="md"
            textAlign="center"
            maxW="400px"
            mx="auto"
        >
            <Stack gap={4}>
                <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    ログインして学習データを保存
                </Text>
                <Text fontSize="sm" color="gray.600">
                    Googleアカウントでログインすると、学習の進捗を保存できます
                </Text>
                <Button
                    onClick={signInWithGoogle}
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    bg="white"
                    _hover={{ bg: 'blue.50' }}
                >
                    <FcGoogle style={{ marginRight: '8px' }} />
                    Googleでログイン
                </Button>
            </Stack>
        </Box>
    )
}