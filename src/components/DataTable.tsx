import { Box, Flex, Image } from '@chakra-ui/react'
import type { Flag, Vocabulary } from '../types/type'

// Union type for data items
type DataItem = Flag | Vocabulary

// Data type configuration
interface DataTypeConfig {
    key: string
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
    typeGuard: (item: DataItem) => boolean
}

// Configuration for different data types
const DATA_TYPE_CONFIGS: Record<string, DataTypeConfig> = {
    flag: {
        key: 'flag',
        headers: { left: '国旗', right: '日本語' },
        leftColumn: {
            flex: "3",
            getContent: (item: DataItem) => {
                if (!('svg' in item)) return null
                const flag = item as Flag
                return (
                    <Image
                        src={flag.svg}
                        alt={`${flag.code} flag`}
                        height="80px"
                        objectFit="contain"
                        onClick={() => {
                            const nameJa = flag.ja.replace(/\s*\(.*?\)/g, '')
                            window.open(`https://ja.wikipedia.org/wiki/${nameJa}`, '_blank')
                        }}
                        cursor="pointer"
                        border="1px solid #ccc"
                    />
                )
            },
            getFontSize: (item: DataItem) =>
                ('code' in item && item.code.length > 20) ? "md" : "xl"
        },
        rightColumn: {
            flex: "7",
            getFontSize: () => "xl"
        },
        typeGuard: (item: DataItem) => 'code' in item && 'svg' in item
    },
    vocabulary: {
        key: 'vocabulary',
        headers: { left: '英語', right: '日本語' },
        leftColumn: {
            getContent: (item: DataItem) => {
                if (!('en' in item)) return null
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
        typeGuard: (item: DataItem) => 'en' in item
    }
}

interface DataTableProps {
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
    currentData,
    currentStartIndex,
    revealedItems,
    isFlipped,
    onRevealItem
}: DataTableProps) => {
    const getDataType = (): DataTypeConfig => {
        console.assert(currentData.length !== 0)
        for (const config of Object.values(DATA_TYPE_CONFIGS)) {
            if (config.typeGuard(currentData[0])) {
                return config
            }
        }
        console.warn('Unknown data type, defaulting to vocabulary config.')
        return DATA_TYPE_CONFIGS.vocabulary
    }

    const config = getDataType()

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
                            {revealed ? item.ja : (item.id.endsWith('-2') ? '復習' : '答え')}
                        </Box>
                    </Flex>
                )
            })}
        </Box>
    )
}