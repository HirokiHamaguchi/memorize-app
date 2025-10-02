import { QuizLayout } from './QuizApp'
import { DataTable } from './DataTable'
import { useStudyData, useQuizApp } from '../hooks'
import type { Geography, Vocabulary } from '../types/type'

type StudyDataItem = Geography | Vocabulary

interface StudyAppProps {
    data: StudyDataItem[]
    rowHeight: number
    config_key: string
}

export const StudyApp = ({
    data,
    rowHeight,
    config_key
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
                config_key={config_key}
                currentData={currentItems}
                currentStartIndex={currentStartIndex}
                revealedItems={revealedItems}
                isFlipped={isFlipped}
                onRevealItem={revealAnswer}
            />
        </QuizLayout>
    )
}