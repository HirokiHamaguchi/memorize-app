import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Vocabulary } from '../types/vocabulary'
import { shuffleArray } from '../utils/shuffle'
import { VOCABULARY_ROW_HEIGHT } from '../config/constant'

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

    // 初回20個ずつ繰り返す
    const REPEAT_INTERVAL = 20 // 1セットあたりの単語数
    useEffect(() => {
        const shuffledArray = shuffleArray(vocabularyData);
        const repeatedVocabulary = [];
        const set_num = Math.ceil(shuffledArray.length / REPEAT_INTERVAL);
        for (let i = 0; i < set_num; i++) {
            for (let repeat_count = 1; repeat_count <= 2; repeat_count++) {
                for (let j = 0; j < REPEAT_INTERVAL; j++) {
                    const index = i * REPEAT_INTERVAL + j;
                    if (index >= shuffledArray.length) break;
                    repeatedVocabulary.push({ ...shuffledArray[index], id: `${shuffledArray[index].id}-${repeat_count}` });
                }
            }
        }
        setShuffledVocabulary(repeatedVocabulary);
    }, [vocabularyData])

    // 現在表示する単語の情報を取得
    const currentWordsInfo = useMemo(() => {
        if (shuffledVocabulary.length === 0) return { words: [], startIndex: 0 }

        const startIndex = Math.max(0, Math.floor(wheelAmount / VOCABULARY_ROW_HEIGHT))
        const endIndex = Math.min(startIndex + wordsPerPage, shuffledVocabulary.length)

        return {
            words: shuffledVocabulary.slice(startIndex, endIndex),
            startIndex: startIndex
        }
    }, [shuffledVocabulary, wheelAmount, wordsPerPage])

    const { words: currentWords, startIndex: currentStartIndex } = currentWordsInfo

    // 日本語の答えを表示する
    const revealJapaneseWord = useCallback((relativeIndex: number) => {
        const absoluteIndex = currentStartIndex + relativeIndex
        setRevealedWords(prev => {
            const next = new Set(prev)
            next.add(absoluteIndex)
            return next
        })
    }, [currentStartIndex])

    return {
        shuffledVocabulary,
        currentWords,
        currentStartIndex,
        revealedWords,
        revealJapaneseWord
    }
}