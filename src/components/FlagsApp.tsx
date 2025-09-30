import { useState } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { AppHeader, FlagsTable } from './index'
import { useScrolling, useFlags, useWordsPerPage } from '../hooks'
import { FLAGS_ROW_HEIGHT } from '../constants'
import type { Flag } from '../types/flags'
import '../App.css'

interface FlagsAppProps {
    flagsData: Flag[]
}

export const FlagsApp = ({ flagsData }: FlagsAppProps) => {
    const [isFlipped, setIsFlipped] = useState(false)

    // カスタムフックを使用
    const wordsPerPage = useWordsPerPage(FLAGS_ROW_HEIGHT)
    const {
        wheelAmount,
        setWheelAmount,
        handleScroll,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    } = useScrolling(wordsPerPage, 2 * flagsData.length, FLAGS_ROW_HEIGHT) // repeatedFlagsを考慮して2倍

    const {
        shuffledFlags,
        currentFlags,
        currentStartIndex,
        revealedFlags,
        revealJapaneseFlag
    } = useFlags(flagsData, wheelAmount, wordsPerPage)
    console.assert(shuffledFlags.length === 2 * flagsData.length)

    // イベントハンドラ
    const nextPage = () => {
        const maxWheelAmount = shuffledFlags.length * FLAGS_ROW_HEIGHT
        const scrollIncrement = FLAGS_ROW_HEIGHT * wordsPerPage
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
                    <FlagsTable
                        currentFlags={currentFlags}
                        currentStartIndex={currentStartIndex}
                        revealedFlags={revealedFlags}
                        isFlipped={isFlipped}
                        onRevealFlag={revealJapaneseFlag}
                    />
                </Box>
            </VStack>
        </Box>
    )
}