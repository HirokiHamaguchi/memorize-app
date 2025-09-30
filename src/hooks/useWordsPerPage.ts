import { useState, useEffect } from 'react'
import { HEADER_HEIGHT, MINIMUM_WORDS_PER_PAGE } from '../constants'

const calculateWordsPerPage = (rowHeight: number, headerHeight: number, minWords: number): number => {
    const availableHeight = window.innerHeight - headerHeight
    return Math.max(minWords, Math.floor(availableHeight / rowHeight) - 1)
}

/**
 * 画面サイズに応じた1ページあたりの単語数を管理するカスタムフック
 */
export const useWordsPerPage = (rowHeight: number) => {
    const getWordsPerPage = () => calculateWordsPerPage(rowHeight, HEADER_HEIGHT, MINIMUM_WORDS_PER_PAGE)

    const [wordsPerPage, setWordsPerPage] = useState(getWordsPerPage())

    // 画面リサイズ時に再計算
    useEffect(() => {
        const handleResize = () => setWordsPerPage(getWordsPerPage())
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })

    return wordsPerPage
}