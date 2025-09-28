// src/components/VocabularyTable.tsx
import { Box, Flex } from '@chakra-ui/react'
import type { Vocabulary } from '../types/vocabulary'

interface VocabularyTableProps {
    currentWords: Vocabulary[]
    currentStartIndex: number
    revealedWords: Set<number>
    isFlipped: boolean
    onRevealWord: (index: number) => void
}

/**
 * 単語テーブルコンポーネント
 */
export const VocabularyTable = ({
    currentWords,
    currentStartIndex,
    revealedWords,
    isFlipped,
    onRevealWord
}: VocabularyTableProps) => {
    return (
        <Box className="vocabulary-box vocabulary-table">
            {/* ヘッダー */}
            <Flex className="table-header" flexDirection={isFlipped ? "row-reverse" : "row"}>
                <Box className="header-cell">
                    英語
                </Box>
                <Box className="header-cell">
                    日本語
                </Box>
            </Flex>

            {/* データ行 */}
            {currentWords.map((word, index) => {
                const absoluteIndex = currentStartIndex + index
                const revealed = revealedWords.has(absoluteIndex)
                return (
                    <Flex
                        key={`${word.id}-${absoluteIndex}`}
                        className="table-row"
                        flexDirection={isFlipped ? "row-reverse" : "row"}
                    >
                        <Box
                            className="english-cell"
                            fontSize={word.en.length > 20 ? "md" : "xl"}
                        >
                            <span
                                style={{ cursor: "pointer" }}
                                onClick={() => { window.open(`https://ejje.weblio.jp/content/${word.en}`, '_blank') }}
                            >
                                {word.en}
                            </span>
                        </Box>
                        <Box
                            className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                            fontSize={revealed ? (word.ja.length > 10 ? "md" : "xl") : "md"}
                            onClick={() => onRevealWord(index)}
                            cursor={revealed ? 'default' : 'pointer'}
                        >
                            {revealed ? word.ja : (word.id.endsWith('-2') ? '復習' : '答え')}
                        </Box>
                    </Flex>
                )
            })}
        </Box>
    )
}