import { useState } from 'react'
import { useScrolling, useWordsPerPage } from './index'

interface UseQuizAppProps {
    dataLength: number
    rowHeight: number
}

export const useQuizApp = ({ dataLength, rowHeight }: UseQuizAppProps) => {
    const [isFlipped, setIsFlipped] = useState(false)

    // カスタムフックを使用
    const wordsPerPage = useWordsPerPage(rowHeight)
    const {
        wheelAmount,
        setWheelAmount,
        handleScroll,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    } = useScrolling(wordsPerPage, 2 * dataLength, rowHeight) // repeatedItemsを考慮して2倍

    // イベントハンドラ
    const nextPage = () => {
        const maxItemCount = 2 * dataLength // 繰り返しを考慮
        const maxWheelAmount = maxItemCount * rowHeight
        const scrollIncrement = rowHeight * wordsPerPage
        setWheelAmount(prev => Math.min(maxWheelAmount, prev + scrollIncrement))
    }

    const toggleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return {
        isFlipped,
        wheelAmount,
        wordsPerPage,
        nextPage,
        toggleFlip,
        scrollHandlers: {
            onWheel: handleScroll,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd
        }
    }
}