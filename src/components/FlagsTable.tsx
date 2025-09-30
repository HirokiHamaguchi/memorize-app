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
                <Box className="header-cell">
                    国旗
                </Box>
                <Box className="header-cell">
                    日本語
                </Box>
            </Flex>

            {/* データ行 */}
            {currentFlags.map((flag, index) => {
                const absoluteIndex = currentStartIndex + index
                const revealed = revealedFlags.has(absoluteIndex)
                return (
                    <Flex
                        key={`${flag.id}-${absoluteIndex}`}
                        className="table-row"
                        flexDirection={isFlipped ? "row-reverse" : "row"}
                    >
                        <Box
                            className="english-cell"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize={flag.code.length > 20 ? "md" : "xl"}
                        >
                            <Image
                                src={flag.svg}
                                alt={`${flag.code} flag`}
                                width="60px"
                                height="45px"
                                objectFit="contain"
                                borderRadius="4px"
                                border="1px solid #e2e8f0"
                            />
                        </Box>
                        <Box
                            className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                            fontSize={revealed ? (flag.ja.length > 10 ? "md" : "xl") : "md"}
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