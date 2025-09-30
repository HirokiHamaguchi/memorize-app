import { useState, useEffect, useCallback } from 'react'
import { SCROLL_SENSITIVITY, TOUCH_SCROLL_SENSITIVITY, MINIMUM_TOUCH_SCROLL } from '../constants'

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
export const useScrolling = (wordsPerPage: number, vocabularyLength: number, rowHeight: number): ScrollingHook => {
    const [wheelAmount, setWheelAmount] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)

    // 最大スクロール量を計算
    const maxWheelAmount = (vocabularyLength - wordsPerPage) * rowHeight

    // マウスホイールイベントハンドラ - useCallbackでメモ化
    const handleScroll = useCallback((e: React.WheelEvent) => {
        setWheelAmount(prev => Math.min(maxWheelAmount, Math.max(0, prev + e.deltaY * SCROLL_SENSITIVITY)))
    }, [maxWheelAmount])

    // タッチイベントハンドラ - useCallbackでメモ化
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientY)
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (touchStart === null) return

        e.preventDefault()
        const currentTouch = e.touches[0].clientY
        const diff = touchStart - currentTouch
        const scrollDelta = diff * TOUCH_SCROLL_SENSITIVITY

        if (Math.abs(scrollDelta) > MINIMUM_TOUCH_SCROLL) {
            setWheelAmount(prev => Math.min(maxWheelAmount, Math.max(0, prev + scrollDelta)))
            setTouchStart(currentTouch)
        }
    }, [touchStart, maxWheelAmount])

    const handleTouchEnd = useCallback(() => {
        setTouchStart(null)
    }, [])

    // キーボードイベントハンドラ
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp':
                setWheelAmount(prev => Math.max(0, prev - rowHeight))
                e.preventDefault()
                break
            case 'ArrowDown':
                setWheelAmount(prev => Math.min(maxWheelAmount, prev + rowHeight))
                e.preventDefault()
                break
            case 'ArrowLeft':
                setWheelAmount(prev => Math.max(0, prev - rowHeight * wordsPerPage))
                e.preventDefault()
                break
            case 'ArrowRight':
                setWheelAmount(prev => Math.min(maxWheelAmount, prev + rowHeight * wordsPerPage))
                e.preventDefault()
                break
        }
    }, [wordsPerPage, rowHeight, maxWheelAmount])

    // グローバルスクロール防止ハンドラ
    const preventGlobalScroll = useCallback((e: Event) => {
        e.preventDefault()
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        window.addEventListener('wheel', preventGlobalScroll, { passive: false })
        window.addEventListener('touchmove', preventGlobalScroll, { passive: false })

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('wheel', preventGlobalScroll)
            window.removeEventListener('touchmove', preventGlobalScroll)
        }
    }, [handleKeyDown, preventGlobalScroll])

    return {
        wheelAmount,
        setWheelAmount,
        handleScroll,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    }
}