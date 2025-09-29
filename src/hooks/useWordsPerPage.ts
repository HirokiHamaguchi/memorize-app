import { useState, useEffect } from 'react'
import { calculateWordsPerPage } from '../utils/vocabulary'
import { ROW_HEIGHT, HEADER_HEIGHT, MINIMUM_WORDS_PER_PAGE } from '../constants'

/**
 * 画面サイズに応じた1ページあたりの単語数を管理するカスタムフック
 */
export const useWordsPerPage = () => {
    const getWordsPerPage = () => calculateWordsPerPage(ROW_HEIGHT, HEADER_HEIGHT, MINIMUM_WORDS_PER_PAGE)

    const [wordsPerPage, setWordsPerPage] = useState(getWordsPerPage())

    // 画面リサイズ時に再計算
    useEffect(() => {
        const handleResize = () => setWordsPerPage(getWordsPerPage())
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return wordsPerPage
}