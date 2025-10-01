import type { Flag, Vocabulary } from '../types/type'

export const VOCABULARY_ROW_HEIGHT = 38 // 語彙学習用の行の高さ(px)
export const FLAGS_ROW_HEIGHT = 89 // フラグ学習用の行の高さ(px)
export const HEADER_HEIGHT = 70 // ヘッダーの高さ(px)
export const MINIMUM_WORDS_PER_PAGE = 3 // 最小表示行数
export const SCROLL_SENSITIVITY = 0.9 // スクロール感度
export const TOUCH_SCROLL_SENSITIVITY = 0.9 // タッチスクロール感度
export const MINIMUM_TOUCH_SCROLL = 5 // 最小タッチスクロール量

// セレクターページの設定
export const STUDY_TYPES = [
    {
        id: 'vocabulary',
        name: '英語語彙',
        description: '英単語と日本語の対応を学習します',
        rowHeight: VOCABULARY_ROW_HEIGHT,
    },
    {
        id: 'flags',
        name: '国旗',
        description: '世界各国の国旗と国名を学習します',
        rowHeight: FLAGS_ROW_HEIGHT,
    }
]

interface VocabularyRawData {
    id: number
    en: string
    ja: string
}

interface FlagsRawData {
    iso: string
    ja: string
    flag: string
    pos: string
}

interface DatasetConfig<T> {
    id: string
    name: string
    description: string
    dataLoader: () => Promise<{ default: T[] }>
    processor: (data: T[]) => (Flag | Vocabulary)[]
}

export const VOCABULARY_DATASETS: DatasetConfig<VocabularyRawData>[] = [
    {
        id: '1',
        name: '英検1級',
        description: '英検1級レベルの英単語集',
        dataLoader: () => import('../data/vocabulary/vocabulary_1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data.map(item => ({ ...item, id: String(item.id) })),
    },
    {
        id: 'jun1',
        name: '英検準1級',
        description: '英検準1級レベルの英単語集',
        dataLoader: () => import('../data/vocabulary/vocabulary_jun1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data.map(item => ({ ...item, id: String(item.id) })),
    }
]

export const FLAGS_DATASETS: DatasetConfig<FlagsRawData>[] = [
    {
        id: 'world',
        name: '世界の国旗',
        description: '世界各国の国旗と国名を学習します',
        dataLoader: () => import('../data/geography/wiki.json'),
        processor: (data: FlagsRawData[]): Flag[] => data.map((item, index) => ({
            id: String(index + 1),
            code: item.iso,
            ja: item.ja,
            flag: item.flag,
            pos: item.pos
        })),
    }
]

// 統合された設定マップ
export const STUDY_CONFIG = {
    vocabulary: {
        type: STUDY_TYPES[0],
        datasets: VOCABULARY_DATASETS,
    },
    flags: {
        type: STUDY_TYPES[1],
        datasets: FLAGS_DATASETS,
    }
} as const

export type StudyType = keyof typeof STUDY_CONFIG