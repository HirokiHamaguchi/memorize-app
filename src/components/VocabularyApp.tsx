import { QuizLayout } from './QuizApp'
import { VocabularyTable } from './index'
import { useVocabulary, useQuizApp } from '../hooks'
import { VOCABULARY_ROW_HEIGHT } from '../constants'
import type { Vocabulary } from '../types/vocabulary'

interface VocabularyAppProps {
    vocabularyData: Vocabulary[]
}

export const VocabularyApp = ({ vocabularyData }: VocabularyAppProps) => {
    const {
        isFlipped,
        wheelAmount,
        wordsPerPage,
        nextPage,
        toggleFlip,
        scrollHandlers
    } = useQuizApp({
        dataLength: vocabularyData.length,
        rowHeight: VOCABULARY_ROW_HEIGHT
    })

    const {
        currentWords,
        currentStartIndex,
        revealedWords,
        revealJapaneseWord
    } = useVocabulary(vocabularyData, wheelAmount, wordsPerPage)

    return (
        <QuizLayout
            isFlipped={isFlipped}
            onToggleFlip={toggleFlip}
            onNextPage={nextPage}
            scrollHandlers={scrollHandlers}
        >
            <VocabularyTable
                currentWords={currentWords}
                currentStartIndex={currentStartIndex}
                revealedWords={revealedWords}
                isFlipped={isFlipped}
                onRevealWord={revealJapaneseWord}
            />
        </QuizLayout>
    )
}