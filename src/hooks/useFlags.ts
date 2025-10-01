import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Flag } from '../types/flags'
import { shuffleArray } from '../utils/shuffle'
import { FLAGS_ROW_HEIGHT } from '../constants'

export interface FlagsHook {
    shuffledFlags: Flag[]
    currentFlags: Flag[]
    currentStartIndex: number
    revealedFlags: Set<number>
    revealJapaneseFlag: (relativeIndex: number) => void
}

/**
 * フラグデータと表示状態を管理するカスタムフック
 */
export const useFlags = (
    flagsData: Flag[],
    wheelAmount: number,
    wordsPerPage: number
): FlagsHook => {
    const [shuffledFlags, setShuffledFlags] = useState<Flag[]>([])
    const [revealedFlags, setRevealedFlags] = useState<Set<number>>(new Set())

    // 初回20個ずつ繰り返す
    const REPEAT_INTERVAL = 20 // 1セットあたりのフラグ数
    useEffect(() => {
        const shuffledArray = shuffleArray(flagsData);
        const repeatedFlags = [];
        const set_num = Math.ceil(shuffledArray.length / REPEAT_INTERVAL);
        for (let i = 0; i < set_num; i++) {
            for (let repeat_count = 1; repeat_count <= 2; repeat_count++) {
                for (let j = 0; j < REPEAT_INTERVAL; j++) {
                    const index = i * REPEAT_INTERVAL + j;
                    if (index >= shuffledArray.length) break;
                    repeatedFlags.push({ ...shuffledArray[index], id: `${shuffledArray[index].id}-${repeat_count}` });
                }
            }
        }
        setShuffledFlags(repeatedFlags);
    }, [flagsData])

    // 現在表示するフラグの情報を取得
    const currentFlagsInfo = useMemo(() => {
        if (shuffledFlags.length === 0) return { flags: [], startIndex: 0 }

        const startIndex = Math.max(0, Math.floor(wheelAmount / FLAGS_ROW_HEIGHT))
        const endIndex = Math.min(startIndex + wordsPerPage, shuffledFlags.length)

        return {
            flags: shuffledFlags.slice(startIndex, endIndex),
            startIndex: startIndex
        }
    }, [shuffledFlags, wheelAmount, wordsPerPage])

    const { flags: currentFlags, startIndex: currentStartIndex } = currentFlagsInfo

    // 日本語の答えを表示する
    const revealJapaneseFlag = useCallback((relativeIndex: number) => {
        const absoluteIndex = currentStartIndex + relativeIndex
        setRevealedFlags(prev => {
            const next = new Set(prev)
            next.add(absoluteIndex)
            return next
        })
    }, [currentStartIndex])

    return {
        shuffledFlags,
        currentFlags,
        currentStartIndex,
        revealedFlags,
        revealJapaneseFlag
    }
}