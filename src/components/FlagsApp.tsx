import { QuizLayout } from './QuizApp'
import { DataTable } from './DataTable'
import { useStudyData, useQuizApp } from '../hooks'
import { FLAGS_ROW_HEIGHT } from '../config/constant'
import type { Flag } from '../types/type'

interface FlagsAppProps {
    flagsData: Flag[]
}

export const FlagsApp = ({ flagsData }: FlagsAppProps) => {
    const {
        isFlipped,
        wheelAmount,
        wordsPerPage,
        nextPage,
        toggleFlip,
        scrollHandlers
    } = useQuizApp({
        dataLength: flagsData.length,
        rowHeight: FLAGS_ROW_HEIGHT
    })

    const {
        currentItems: currentFlags,
        currentStartIndex,
        revealedItems: revealedFlags,
        revealAnswer: revealJapaneseFlag
    } = useStudyData(flagsData, wheelAmount, wordsPerPage, FLAGS_ROW_HEIGHT)

    return (
        <QuizLayout
            isFlipped={isFlipped}
            onToggleFlip={toggleFlip}
            onNextPage={nextPage}
            scrollHandlers={scrollHandlers}
        >
            <DataTable
                currentData={currentFlags}
                currentStartIndex={currentStartIndex}
                revealedItems={revealedFlags}
                isFlipped={isFlipped}
                onRevealItem={revealJapaneseFlag}
            />
        </QuizLayout>
    )
}