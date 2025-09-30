import { useState } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { AppHeader, VocabularyTable } from './index'
import { useScrolling, useVocabulary, useWordsPerPage } from '../hooks'
import { VOCABULARY_ROW_HEIGHT } from '../constants'
import type { Vocabulary } from '../types/vocabulary'
import '../App.css'

interface VocabularyAppProps {
    vocabularyData: Vocabulary[]
}

export const VocabularyApp = ({ vocabularyData }: VocabularyAppProps) => {
    const [isFlipped, setIsFlipped] = useState(false)

    // カスタムフックを使用
    const wordsPerPage = useWordsPerPage(VOCABULARY_ROW_HEIGHT)
    const {
        wheelAmount,
        setWheelAmount,
        handleScroll,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    } = useScrolling(wordsPerPage, 2 * vocabularyData.length, VOCABULARY_ROW_HEIGHT) // repeatedVocabularyを考慮して2倍

    const {
        shuffledVocabulary,
        currentWords,
        currentStartIndex,
        revealedWords,
        revealJapaneseWord
    } = useVocabulary(vocabularyData, wheelAmount, wordsPerPage)
    console.assert(shuffledVocabulary.length === 2 * vocabularyData.length)

    // イベントハンドラ
    const nextPage = () => {
        const maxWheelAmount = shuffledVocabulary.length * VOCABULARY_ROW_HEIGHT
        const scrollIncrement = VOCABULARY_ROW_HEIGHT * wordsPerPage
        setWheelAmount(prev => Math.min(maxWheelAmount, prev + scrollIncrement))
    }

    const toggleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <Box className="app-container">
            <VStack height="100%">
                {/* ヘッダー部分 */}
                <AppHeader
                    isFlipped={isFlipped}
                    onToggleFlip={toggleFlip}
                    onNextPage={nextPage}
                />

                {/* テーブル部分 */}
                <Box
                    className="table-container"
                    onWheel={handleScroll}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <VocabularyTable
                        currentWords={currentWords}
                        currentStartIndex={currentStartIndex}
                        revealedWords={revealedWords}
                        isFlipped={isFlipped}
                        onRevealWord={revealJapaneseWord}
                    />
                </Box>
            </VStack>
        </Box>
    )
}