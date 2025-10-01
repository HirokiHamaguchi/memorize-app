import { QuizLayout } from './QuizApp'
import { DataTable } from './DataTable'
import { useStudyData, useQuizApp } from '../hooks'
import type { Flag, Vocabulary } from '../types/type'

type StudyDataItem = Flag | Vocabulary

interface StudyAppProps {
    data: StudyDataItem[]
    rowHeight: number
}

export const StudyApp = ({
    data,
    rowHeight
}: StudyAppProps) => {
    const {
        isFlipped,
        wheelAmount,
        wordsPerPage,
        nextPage,
        toggleFlip,
        scrollHandlers
    } = useQuizApp({
        dataLength: data.length,
        rowHeight
    })

    const {
        currentItems,
        currentStartIndex,
        revealedItems,
        revealAnswer
    } = useStudyData(data, wheelAmount, wordsPerPage, rowHeight)

    return (
        <QuizLayout
            isFlipped={isFlipped}
            onToggleFlip={toggleFlip}
            onNextPage={nextPage}
            scrollHandlers={scrollHandlers}
        >
            <DataTable
                currentData={currentItems}
                currentStartIndex={currentStartIndex}
                revealedItems={revealedItems}
                isFlipped={isFlipped}
                onRevealItem={revealAnswer}
            />
        </QuizLayout>
    )
}