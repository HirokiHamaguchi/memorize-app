import { useState, useEffect, useMemo, useCallback } from 'react'
import { shuffleArray } from '../utils/shuffle'
import { VOCABULARY_ROW_HEIGHT, FLAGS_ROW_HEIGHT } from '../config/constant'
import type { Vocabulary, Flag } from '../types/type'

export interface StudyDataHook<T> {
    shuffledData: T[]
    currentItems: T[]
    currentStartIndex: number
    revealedItems: Set<number>
    revealJapaneseItem: (relativeIndex: number) => void
}

/**
 * 学習データと表示状態を管理するカスタムフック（汎用）
 * @template T - 学習データの型（Flag, Vocabulary など）
 */
export const useStudyData = <T extends { id: string }>(
    data: T[],
    wheelAmount: number,
    itemsPerPage: number,
    rowHeight: number
): StudyDataHook<T> => {
    const [shuffledData, setShuffledData] = useState<T[]>([])
    const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set())

    // 初回20個ずつ繰り返す
    const REPEAT_INTERVAL = 20 // 1セットあたりのアイテム数
    useEffect(() => {
        const shuffledArray = shuffleArray(data);
        const repeatedData = [];
        const set_num = Math.ceil(shuffledArray.length / REPEAT_INTERVAL);
        for (let i = 0; i < set_num; i++) {
            for (let repeat_count = 1; repeat_count <= 2; repeat_count++) {
                for (let j = 0; j < REPEAT_INTERVAL; j++) {
                    const index = i * REPEAT_INTERVAL + j;
                    if (index >= shuffledArray.length) break;
                    repeatedData.push({ ...shuffledArray[index], id: `${shuffledArray[index].id}-${repeat_count}` });
                }
            }
        }
        setShuffledData(repeatedData);
    }, [data])

    // 現在表示するアイテムの情報を取得
    const currentItemsInfo = useMemo(() => {
        if (shuffledData.length === 0) return { items: [], startIndex: 0 }

        const startIndex = Math.max(0, Math.floor(wheelAmount / rowHeight))
        const endIndex = Math.min(startIndex + itemsPerPage, shuffledData.length)

        return {
            items: shuffledData.slice(startIndex, endIndex),
            startIndex: startIndex
        }
    }, [shuffledData, wheelAmount, itemsPerPage, rowHeight])

    const { items: currentItems, startIndex: currentStartIndex } = currentItemsInfo

    // 日本語の答えを表示する
    const revealJapaneseItem = useCallback((relativeIndex: number) => {
        const absoluteIndex = currentStartIndex + relativeIndex
        setRevealedItems(prev => {
            const next = new Set(prev)
            next.add(absoluteIndex)
            return next
        })
    }, [currentStartIndex])

    return {
        shuffledData,
        currentItems,
        currentStartIndex,
        revealedItems,
        revealJapaneseItem
    }
}

// 後方互換性のための型エイリアス
export type VocabularyHook = {
    shuffledVocabulary: Vocabulary[]
    currentWords: Vocabulary[]
    currentStartIndex: number
    revealedWords: Set<number>
    revealJapaneseWord: (relativeIndex: number) => void
}

export type FlagsHook = {
    shuffledFlags: Flag[]
    currentFlags: Flag[]
    currentStartIndex: number
    revealedFlags: Set<number>
    revealJapaneseFlag: (relativeIndex: number) => void
}

// 後方互換性のためのラッパー関数
export const useVocabulary = (
    vocabularyData: Vocabulary[],
    wheelAmount: number,
    wordsPerPage: number
): VocabularyHook => {
    const result = useStudyData(vocabularyData, wheelAmount, wordsPerPage, VOCABULARY_ROW_HEIGHT)

    return {
        shuffledVocabulary: result.shuffledData,
        currentWords: result.currentItems,
        currentStartIndex: result.currentStartIndex,
        revealedWords: result.revealedItems,
        revealJapaneseWord: result.revealJapaneseItem
    }
}

export const useFlags = (
    flagsData: Flag[],
    wheelAmount: number,
    wordsPerPage: number
): FlagsHook => {
    const result = useStudyData(flagsData, wheelAmount, wordsPerPage, FLAGS_ROW_HEIGHT)

    return {
        shuffledFlags: result.shuffledData,
        currentFlags: result.currentItems,
        currentStartIndex: result.currentStartIndex,
        revealedFlags: result.revealedItems,
        revealJapaneseFlag: result.revealJapaneseItem
    }
}