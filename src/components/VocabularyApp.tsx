import { QuizLayout } from './QuizApp'
import { DataTable } from './DataTable'
import { useStudyData, useQuizApp } from '../hooks'
import { VOCABULARY_ROW_HEIGHT } from '../config/constant'
import type { Vocabulary } from '../types/type'

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
        currentItems: currentWords,
        currentStartIndex,
        revealedItems: revealedWords,
        revealAnswer: revealJapaneseWord
    } = useStudyData(vocabularyData, wheelAmount, wordsPerPage, VOCABULARY_ROW_HEIGHT)

    return (
        <QuizLayout
            isFlipped={isFlipped}
            onToggleFlip={toggleFlip}
            onNextPage={nextPage}
            scrollHandlers={scrollHandlers}
        >
            <DataTable
                currentData={currentWords}
                currentStartIndex={currentStartIndex}
                revealedItems={revealedWords}
                isFlipped={isFlipped}
                onRevealItem={revealJapaneseWord}
            />
        </QuizLayout>
    )
}