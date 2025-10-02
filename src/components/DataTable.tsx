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
    },
    geography_location: {
        headers: { left: '位置', right: '日本語' },
        leftColumn: {
            flex: "10",
            getContent: (item: DataItem) => {
                const location = item as Geography
                return (
                    <Image
                        src={location.pos}
                        alt={`${location.iso} location`}
                        height="80px"
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
    }
}

interface DataTableProps {
    config_key: string
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
    config_key,
    currentData,
    currentStartIndex,
    revealedItems,
    isFlipped,
    onRevealItem
}: DataTableProps) => {
    console.assert(config_key in DATA_TYPE_CONFIGS, `Invalid config key: ${config_key}`)
    const config = DATA_TYPE_CONFIGS[config_key]
    return (
        <Box className="vocabulary-box vocabulary-table">
            <Flex className="table-header" flexDirection={isFlipped ? "row-reverse" : "row"}>
                <Box className="header-cell" flex={config.leftColumn.flex}>
                    {config.headers.left}
                </Box>
                <Box className="header-cell" flex={config.rightColumn.flex} >
                    {config.headers.right}
                </Box>
            </Flex>

            {currentData.map((item, index) => {
                const absoluteIndex = currentStartIndex + index
                const revealed = revealedItems.has(absoluteIndex)

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
                            {revealed ? item.ja : (item.id % 2 == 1 ? '復習' : '答え')}
                        </Box>
                    </Flex>
                )
            })}
        </Box>
    )
}