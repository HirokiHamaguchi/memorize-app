import { Text, Flex, Link, VStack } from '@chakra-ui/react'
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"


const LINK_STYLES = {
    target: "_blank",
    rel: "noopener noreferrer",
    color: "blue.500",
    textDecoration: "underline"
}

// リンクデータの型定義
interface LinkData {
    href: string
    text: string
    description: string
}

// リンクデータ
const APP_LINKS: LinkData[] = [
    {
        href: "https://www.eigo-duke.com/tango/eiken1.html",
        text: "英語漬け.com",
        description: "英単語の一覧は{link}のページから借用しています。"
    },
    {
        href: "https://ejje.weblio.jp/",
        text: "Weblio",
        description: "英単語を押すと、{link}の該当ページに飛びます。"
    },
    {
        href: "https://github.com/HirokiHamaguchi/vocabulary-app",
        text: "GitHub",
        description: "バグや改善要望などは{link}にお願いします。"
    }
]


// アプリ情報ダイアログコンポーネント
export const AppInfoDialog = () => (
    <Dialog.Root size="md" placement="center" motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>
            <Button backgroundColor="white" color="black" size="sm">
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    cursor="pointer"
                    _hover={{ color: "blue.500" }}
                    transition="all 0.2s"
                >
                    英単語暗記アプリ
                </Text>
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
            <Dialog.Positioner>
                <Dialog.Content
                    borderRadius="xl"
                    boxShadow="2xl"
                    border="1px solid"
                    borderColor="gray.200"
                    bg="white"
                    maxW="500px"
                    mx={4}
                >
                    <Dialog.Header
                        borderTopRadius="xl"
                        px={6}
                        py={4}
                    >
                        <Dialog.Title fontSize="lg" fontWeight="bold">
                            このアプリについて
                        </Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton
                                size="sm"
                                borderRadius="md"
                            />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body px={6} py={5}>
                        <VStack alignItems="start" gap={5}>
                            <Text
                                fontSize="md"
                                color="gray.700"
                                fontWeight="medium"
                                bg="blue.50"
                                px={4}
                                py={2}
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderLeftColor="blue.400"
                            >
                                📚 英単語の暗記学習をサポートするアプリです
                            </Text>
                            <VStack alignItems="start" gap={3} w="full">
                                {APP_LINKS.map(({ href, text, description }, index) => (
                                    <Flex
                                        key={index}
                                        p={3}
                                        bg="gray.50"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        w="full"
                                    >
                                        <Text fontSize="sm" color="gray.600" lineHeight={1.6}>
                                            {description.split('{link}')[0]}
                                            <Link
                                                href={href}
                                                {...LINK_STYLES}
                                                fontWeight="semibold"
                                                _hover={{
                                                    color: "blue.600"
                                                }}
                                            >
                                                {text}
                                            </Link>
                                            {description.split('{link}')[1]}
                                        </Text>
                                    </Flex>
                                ))}
                            </VStack>
                        </VStack>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog.Root>
)
