// src/hooks/useVocabulary.ts
import { useState, useEffect } from 'react'
import type { Vocabulary } from '../types/vocabulary'
import { shuffleArray } from '../utils/vocabulary'
import { ROW_HEIGHT } from '../constants'

export interface VocabularyHook {
    shuffledVocabulary: Vocabulary[]
    currentWords: Vocabulary[]
    currentStartIndex: number
    revealedWords: Set<number>
    revealJapaneseWord: (relativeIndex: number) => void
}

/**
 * 単語データと表示状態を管理するカスタムフック
 */
export const useVocabulary = (
    vocabularyData: Vocabulary[],
    wheelAmount: number,
    wordsPerPage: number
): VocabularyHook => {
    const [shuffledVocabulary, setShuffledVocabulary] = useState<Vocabulary[]>([])
    const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set())

    // 初回レンダリング時に単語をシャッフル
    useEffect(() => {
        setShuffledVocabulary(shuffleArray(vocabularyData))
    }, [vocabularyData])

    // 現在表示する単語の情報を取得
    const getCurrentWordsInfo = () => {
        if (shuffledVocabulary.length === 0) return { words: [], startIndex: 0 }

        const startIndex = Math.max(0, Math.floor(wheelAmount / ROW_HEIGHT))
        const clampedStartIndex = Math.min(startIndex, Math.max(0, shuffledVocabulary.length - wordsPerPage))
        const endIndex = Math.min(clampedStartIndex + wordsPerPage, shuffledVocabulary.length)

        return {
            words: shuffledVocabulary.slice(clampedStartIndex, endIndex),
            startIndex: clampedStartIndex
        }
    }

    const { words: currentWords, startIndex: currentStartIndex } = getCurrentWordsInfo()

    // 日本語の答えを表示する
    const revealJapaneseWord = (relativeIndex: number) => {
        const absoluteIndex = currentStartIndex + relativeIndex
        setRevealedWords(prev => {
            const next = new Set(prev)
            next.add(absoluteIndex)
            return next
        })
    }

    return {
        shuffledVocabulary,
        currentWords,
        currentStartIndex,
        revealedWords,
        revealJapaneseWord
    }
}