import { Box, Flex, Image } from '@chakra-ui/react'
import { useEffect, useMemo, useCallback } from 'react'
import type { Geography, Vocabulary } from '../types/type'

// Constants for performance optimization
const IS_WINDOWS = navigator.userAgent.toLowerCase().includes('windows')
const EMOJI_FONT_FAMILY = "'NotoColorEmojiLimited', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
const EMOJI_STYLE: React.CSSProperties = IS_WINDOWS ? { fontFamily: EMOJI_FONT_FAMILY } : {}

// Load Noto Color Emoji font for better emoji support on Windows
// Source: https://github.com/googlefonts/noto-emoji
const loadNotoColorEmojiFont = () => {
    // Check if font is already loaded
    if (document.querySelector('#noto-color-emoji-font')) {
        return
    }

    const style = document.createElement('style')
    style.id = 'noto-color-emoji-font'
    style.textContent = `
        @font-face {
            font-family: 'NotoColorEmojiLimited';
            unicode-range: U+1F1E6-1F1FF;
            src: url(https://raw.githack.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf);
        }
    `
    document.head.appendChild(style)
}

// Helper functions for common operations
const openWikipediaLink = (url: string) => {
    window.open(`https://ja.wikipedia.org/wiki/${url}`, '_blank')
}

const openWeblioLink = (word: string) => {
    window.open(`https://ejje.weblio.jp/content/${word}`, '_blank')
}

// Union type for data items
type DataItem = Geography | Vocabulary

// Data type configuration
interface DataTypeConfig {
    headers: {
        left: string
        right: string
    }
    leftColumn: {
        flex?: string
        getContent: (item: DataItem) => React.ReactNode
    }
    rightColumn: {
        flex?: string
    }
    isVerticalLayout: boolean
}

// Configuration for different data types
const DATA_TYPE_CONFIGS: Record<string, DataTypeConfig> = {
    geography_flag: {
        headers: { left: '国旗', right: '日本語' },
        leftColumn: {
            flex: "3",
            getContent: (item: DataItem) => {
                const flag = item as Geography
                return (
                    <Image
                        src={flag.flag}
                        alt={`${flag.iso} flag`}
                        height="80px"
                        objectFit="contain"
                        onClick={() => openWikipediaLink(flag.url)}
                        cursor="pointer"
                        border="1px solid #ccc"
                    />
                )
            }
        },
        rightColumn: {
            flex: "7"
        },
        isVerticalLayout: false
    },
    geography_location: {
        headers: { left: '位置', right: '日本語' },
        leftColumn: {
            flex: "1",
            getContent: (item: DataItem) => {
                const location = item as Geography
                return (
                    <Image
                        src={location.pos}
                        alt={`${location.iso} location`}
                        height="460px"
                        objectFit="contain"
                        onClick={() => openWikipediaLink(location.url)}
                        cursor="pointer"
                        border="1px solid #ccc"
                    />
                )
            }
        },
        rightColumn: {
            flex: "1"
        },
        isVerticalLayout: true
    },
    geography_capital: {
        headers: { left: '国名', right: '首都' },
        leftColumn: {
            getContent: (item: DataItem) => {
                const country = item as Geography
                return (
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => openWikipediaLink(country.url)}
                    >
                        <span style={EMOJI_STYLE}>{country.emoji}</span>{country.ja}
                    </span>
                )
            }
        },
        rightColumn: {},
        isVerticalLayout: false
    },
    vocabulary: {
        headers: { left: '英語', right: '日本語' },
        leftColumn: {
            getContent: (item: DataItem) => {
                const vocabulary = item as Vocabulary
                return (
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => openWeblioLink(vocabulary.en)}
                    >
                        {vocabulary.en}
                    </span>
                )
            }
        },
        rightColumn: {},
        isVerticalLayout: false
    }
}

interface DataTableProps {
    configKey: string
    currentData: DataItem[]
    currentStartIndex: number
    revealedItems: Set<number>
    isFlipped: boolean
    onRevealItem: (index: number) => void
}

/**
 * 統合されたデータテーブルコンポーネント（設定ベース）
 */
export const DataTable = ({
    configKey,
    currentData,
    currentStartIndex,
    revealedItems,
    isFlipped,
    onRevealItem
}: DataTableProps) => {
    console.assert(configKey in DATA_TYPE_CONFIGS, `Invalid config key: ${configKey}`)
    const config = DATA_TYPE_CONFIGS[configKey]

    // Load Noto Color Emoji font for Windows emoji support
    useEffect(() => {
        if (IS_WINDOWS) loadNotoColorEmojiFont()
    }, [])

    const toAnswer = useCallback((item: DataItem) => {
        if (configKey === 'geography_location' && 'emoji' in item) {
            return (
                <span>
                    {item.ja}
                    <span style={EMOJI_STYLE}>{item.emoji}</span>
                </span>
            )
        }

        if (configKey === 'geography_capital' && 'capital' in item && 'note' in item) {
            const country = item as Geography
            const capitalName = country.note ? `${country.capital}${country.note}` : country.capital
            return capitalName
        }

        return item.ja
    }, [configKey])

    // Enterキーで未表示の最初のアイテムを表示する
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                // 現在表示されているデータの中で、まだrevealされていない最初のアイテムを探す
                const firstUnrevealedIndex = currentData.findIndex((_, index) => {
                    const absoluteIndex = currentStartIndex + index
                    return !revealedItems.has(absoluteIndex)
                })

                if (firstUnrevealedIndex !== -1) {
                    onRevealItem(firstUnrevealedIndex)
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentData, currentStartIndex, revealedItems, onRevealItem])

    // Memoize the rendered table rows for better performance
    const tableRows = useMemo(() => {
        return currentData.map((item, index) => {
            const absoluteIndex = currentStartIndex + index
            const revealed = revealedItems.has(absoluteIndex)
            const placeholderText = item.id % 2 == 1 ? '復習' : '答え'

            if (config.isVerticalLayout) {
                return (
                    <Box
                        key={`${item.id}-${absoluteIndex}`}
                        className="table-row"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {config.leftColumn.getContent(item)}
                        </Box>
                        <Box
                            className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => onRevealItem(index)}
                            cursor={revealed ? 'default' : 'pointer'}
                            borderTop="1px solid #ccc"
                        >
                            {revealed ? toAnswer(item) : placeholderText}
                        </Box>
                    </Box>
                )
            } else {
                return (
                    <Flex
                        key={`${item.id}-${absoluteIndex}`}
                        className="table-row"
                        flexDirection={isFlipped ? "row-reverse" : "row"}
                    >
                        <Box
                            className="english-cell"
                            flex={config.leftColumn.flex}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {config.leftColumn.getContent(item)}
                        </Box>
                        <Box
                            className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                            flex={config.rightColumn.flex}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => onRevealItem(index)}
                            cursor={revealed ? 'default' : 'pointer'}
                        >
                            {revealed ? toAnswer(item) : placeholderText}
                        </Box>
                    </Flex>
                )
            }
        })
    }, [currentData, currentStartIndex, revealedItems, config, isFlipped, onRevealItem, toAnswer])

    return (
        <Box className="vocabulary-box vocabulary-table">
            {!config.isVerticalLayout && (
                <Flex className="table-header" flexDirection={isFlipped ? "row-reverse" : "row"}>
                    <Box className="header-cell" flex={config.leftColumn.flex}>
                        {config.headers.left}
                    </Box>
                    <Box className="header-cell" flex={config.rightColumn.flex} >
                        {config.headers.right}
                    </Box>
                </Flex>
            )}

            {tableRows}
        </Box>
    )
}