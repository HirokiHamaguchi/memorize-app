import { QuizLayout } from './QuizApp'
import { DataTable } from './DataTable'
import { useFlags, useQuizApp } from '../hooks'
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
        currentFlags,
        currentStartIndex,
        revealedFlags,
        revealJapaneseFlag
    } = useFlags(flagsData, wheelAmount, wordsPerPage)

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