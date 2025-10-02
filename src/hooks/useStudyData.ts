import { useState, useEffect, useMemo, useCallback } from 'react'
import { shuffleArray } from '../utils/shuffle'

export interface StudyDataHook<T> {
    shuffledData: T[]
    currentItems: T[]
    currentStartIndex: number
    revealedItems: Set<number>
    revealAnswer: (relativeIndex: number) => void
}

export const useStudyData = <T extends { id: number }>(
    data: T[],
    wheelAmount: number,
    itemsPerPage: number,
    rowHeight: number
): StudyDataHook<T> => {
    const [shuffledData, setShuffledData] = useState<T[]>([])
    const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set())

    const REPEAT_INTERVAL = 20 // 1セットあたりのアイテム数
    useEffect(() => {
        const shuffledArray = shuffleArray(data);
        const repeatedData: T[] = [];
        const set_num = Math.ceil(shuffledArray.length / REPEAT_INTERVAL);
        for (let i = 0; i < set_num; i++) {
            for (let repeat_count = 0; repeat_count < 2; repeat_count++) {
                for (let j = 0; j < REPEAT_INTERVAL; j++) {
                    const index = i * REPEAT_INTERVAL + j;
                    if (index >= shuffledArray.length) break;
                    repeatedData.push({ ...shuffledArray[index], id: 2 * shuffledArray[index].id + repeat_count });
                }
            }
        }
        setShuffledData(repeatedData);
    }, [data])

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

    const revealAnswer = useCallback((relativeIndex: number) => {
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
        revealAnswer
    }
}