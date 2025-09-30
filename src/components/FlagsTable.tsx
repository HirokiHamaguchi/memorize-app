import { Box, Flex, Image } from '@chakra-ui/react'
import type { Flag } from '../types/flags'

interface FlagsTableProps {
    currentFlags: Flag[]
    currentStartIndex: number
    revealedFlags: Set<number>
    isFlipped: boolean
    onRevealFlag: (index: number) => void
}

/**
 * フラグテーブルコンポーネント
 */
export const FlagsTable = ({
    currentFlags,
    currentStartIndex,
    revealedFlags,
    isFlipped,
    onRevealFlag
}: FlagsTableProps) => {
    return (
        <Box className="vocabulary-box vocabulary-table">
            {/* ヘッダー */}
            <Flex className="table-header" flexDirection={isFlipped ? "row-reverse" : "row"}>
                <Box className="header-cell" flex="3">
                    国旗
                </Box>
                <Box className="header-cell" flex="7">
                    日本語
                </Box>
            </Flex>

            {/* データ行 */}
            {currentFlags.map((flag, index) => {
                const absoluteIndex = currentStartIndex + index
                const revealed = revealedFlags.has(absoluteIndex)
                const nameJa = flag.ja.replace(/\s*\(.*?\)/g, '')
                return (
                    <Flex
                        key={`${flag.id}-${absoluteIndex}`}
                        className="table-row"
                        flexDirection={isFlipped ? "row-reverse" : "row"}
                    >
                        <Box
                            className="english-cell"
                            flex="3"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize={flag.code.length > 20 ? "md" : "xl"}
                        >
                            <Image
                                src={flag.svg}
                                alt={`${flag.code} flag`}
                                height="80px"
                                objectFit="contain"
                                onClick={
                                    () => { window.open(`https://ja.wikipedia.org/wiki/${nameJa}`, '_blank') }
                                }
                                cursor="pointer"
                                border="1px solid #ccc"
                            />
                        </Box>
                        <Box
                            className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                            flex="7"
                            justifyContent="center"
                            fontSize={revealed ? "xl" : "md"}
                            onClick={() => onRevealFlag(index)}
                            cursor={revealed ? 'default' : 'pointer'}
                        >
                            {revealed ? flag.ja : (flag.id.endsWith('-2') ? '復習' : '答え')}
                        </Box>
                    </Flex>
                )
            })}
        </Box>
    )
}