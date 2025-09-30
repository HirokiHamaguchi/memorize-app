import { QuizLayout } from './QuizApp'
import { FlagsTable } from './index'
import { useFlags, useQuizApp } from '../hooks'
import { FLAGS_ROW_HEIGHT } from '../constants'
import type { Flag } from '../types/flags'

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
            <FlagsTable
                currentFlags={currentFlags}
                currentStartIndex={currentStartIndex}
                revealedFlags={revealedFlags}
                isFlipped={isFlipped}
                onRevealFlag={revealJapaneseFlag}
            />
        </QuizLayout>
    )
}