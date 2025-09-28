// src/utils/vocabulary.ts
import type { Vocabulary } from '../types/vocabulary'

/**
 * Fisher-Yatesシャッフルアルゴリズム
 * 配列をランダムにシャッフルします
 */
export const shuffleArray = (array: Vocabulary[]): Vocabulary[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
}

/**
 * 画面サイズに基づいて1ページあたりの単語数を計算
 */
export const calculateWordsPerPage = (rowHeight: number, headerHeight: number, minWords: number): number => {
    const availableHeight = window.innerHeight - headerHeight
    return Math.max(minWords, Math.floor(availableHeight / rowHeight) - 1)
}