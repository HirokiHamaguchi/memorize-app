import { Box, Flex, Image } from '@chakra-ui/react'
import type { Geography, Vocabulary } from '../types/type'

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
        getFontSize: (item: DataItem) => string
    }
    rightColumn: {
        flex?: string
        getFontSize: (item: DataItem, revealed: boolean) => string
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
                        onClick={() => {
                            window.open(`https://ja.wikipedia.org/wiki/${flag.url}`, '_blank')
                        }}
                        cursor="pointer"
                        border="1px solid #ccc"
                    />
                )
            },
            getFontSize: (item: DataItem) =>
                ('iso' in item && item.iso.length > 20) ? "md" : "xl"
        },
        rightColumn: {
            flex: "7",
            getFontSize: () => "xl"
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
                        onClick={() => {
                            window.open(`https://ja.wikipedia.org/wiki/${location.url}`, '_blank')
                        }}
                        cursor="pointer"
                        border="1px solid #ccc"
                    />
                )
            },
            getFontSize: (item: DataItem) =>
                ('iso' in item && item.iso.length > 20) ? "md" : "xl"
        },
        rightColumn: {
            flex: "1",
            getFontSize: () => "xl"
        },
        isVerticalLayout: true
    },
    vocabulary: {
        headers: { left: '英語', right: '日本語' },
        leftColumn: {
            getContent: (item: DataItem) => {
                const vocabulary = item as Vocabulary
                return (
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            window.open(`https://ejje.weblio.jp/content/${vocabulary.en}`, '_blank')
                        }}
                    >
                        {vocabulary.en}
                    </span>
                )
            },
            getFontSize: (item: DataItem) =>
                ('en' in item && item.en.length > 20) ? "md" : "xl"
        },
        rightColumn: {
            getFontSize: (item: DataItem, revealed: boolean) =>
                revealed ? (item.ja.length > 10 ? "md" : "xl") : "md"
        },
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
    const toAnswer = (item: DataItem) => (configKey === 'geography_location' && 'emoji' in item) ? item.ja + item.emoji : item.ja
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

            {currentData.map((item, index) => {
                const absoluteIndex = currentStartIndex + index
                const revealed = revealedItems.has(absoluteIndex)

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
                                fontSize={config.leftColumn.getFontSize(item)}
                            >
                                {config.leftColumn.getContent(item)}
                            </Box>
                            <Box
                                className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                                alignItems="center"
                                justifyContent="center"
                                fontSize={config.rightColumn.getFontSize(item, revealed)}
                                onClick={() => onRevealItem(index)}
                                cursor={revealed ? 'default' : 'pointer'}
                                borderTop="1px solid #ccc"
                            >
                                {revealed ? toAnswer(item) : (item.id % 2 == 1 ? '復習' : '答え')}
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
                                fontSize={config.leftColumn.getFontSize(item)}
                            >
                                {config.leftColumn.getContent(item)}
                            </Box>
                            <Box
                                className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                                flex={config.rightColumn.flex}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize={config.rightColumn.getFontSize(item, revealed)}
                                onClick={() => onRevealItem(index)}
                                cursor={revealed ? 'default' : 'pointer'}
                            >
                                {revealed ? toAnswer(item) : (item.id % 2 == 1 ? '復習' : '答え')}
                            </Box>
                        </Flex>
                    )
                }
            })}
        </Box>
    )
}