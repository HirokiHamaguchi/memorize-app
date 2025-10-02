import { useState, useEffect } from 'react'
import { HEADER_HEIGHT } from '../config/constant'

const calculateWordsPerPage = (rowHeight: number, headerHeight: number): number => {
    const availableHeight = window.innerHeight - headerHeight
    return Math.max(1, Math.floor(availableHeight / rowHeight) - 1)
}

/**
 * 画面サイズに応じた1ページあたりの単語数を管理するカスタムフック
 */
export const useWordsPerPage = (rowHeight: number) => {
    const getWordsPerPage = () => calculateWordsPerPage(rowHeight, HEADER_HEIGHT)

    const [wordsPerPage, setWordsPerPage] = useState(getWordsPerPage())

    // 画面リサイズ時に再計算
    useEffect(() => {
        const handleResize = () => setWordsPerPage(getWordsPerPage())
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })

    return wordsPerPage
}