// src/hooks/useScrolling.ts
import { useState, useEffect, useCallback } from 'react'
import { ROW_HEIGHT, SCROLL_SENSITIVITY, TOUCH_SCROLL_SENSITIVITY, MINIMUM_TOUCH_SCROLL } from '../constants'

export interface ScrollingHook {
    wheelAmount: number
    setWheelAmount: React.Dispatch<React.SetStateAction<number>>
    handleScroll: (e: React.WheelEvent) => void
    handleTouchStart: (e: React.TouchEvent) => void
    handleTouchMove: (e: React.TouchEvent) => void
    handleTouchEnd: () => void
}

/**
 * スクロール操作（ホイール、タッチ、キーボード）を管理するカスタムフック
 */
export const useScrolling = (wordsPerPage: number, vocabularyLength: number): ScrollingHook => {
    const [wheelAmount, setWheelAmount] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)

    // 最大スクロール量を計算
    const maxWheelAmount = (vocabularyLength - wordsPerPage) * ROW_HEIGHT

    // マウスホイールイベントハンドラ
    const handleScroll = (e: React.WheelEvent) => {
        setWheelAmount(prev => Math.min(maxWheelAmount, Math.max(0, prev + e.deltaY * SCROLL_SENSITIVITY)))
    }

    // タッチイベントハンドラ
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientY)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStart === null) return

        const currentTouch = e.touches[0].clientY
        const diff = touchStart - currentTouch
        const scrollDelta = diff * TOUCH_SCROLL_SENSITIVITY

        if (Math.abs(scrollDelta) > MINIMUM_TOUCH_SCROLL) {
            setWheelAmount(prev => Math.min(maxWheelAmount, Math.max(0, prev + scrollDelta)))
            setTouchStart(currentTouch)
        }
    }

    const handleTouchEnd = () => {
        setTouchStart(null)
    }

    // キーボードイベントハンドラ
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp':
                setWheelAmount(prev => Math.max(0, prev - ROW_HEIGHT))
                e.preventDefault()
                break
            case 'ArrowDown':
                setWheelAmount(prev => Math.min(maxWheelAmount, prev + ROW_HEIGHT))
                e.preventDefault()
                break
            case 'ArrowLeft':
                setWheelAmount(prev => Math.max(0, prev - ROW_HEIGHT * wordsPerPage))
                e.preventDefault()
                break
            case 'ArrowRight':
                setWheelAmount(prev => Math.min(maxWheelAmount, prev + ROW_HEIGHT * wordsPerPage))
                e.preventDefault()
                break
        }
    }, [wordsPerPage, maxWheelAmount])

    // キーボードイベントリスナーを登録
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    return {
        wheelAmount,
        setWheelAmount,
        handleScroll,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    }
}