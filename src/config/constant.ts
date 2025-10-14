import type { Geography, Vocabulary } from '../types/type'

export const HEADER_HEIGHT = 70 // ヘッダーの高さ(px)
export const SELECT_HEADER_HEIGHT = 90 // ヘッダーの高さ(px)
export const MINIMUM_TOUCH_SCROLL = 5 // 最小タッチスクロール量

// セレクターページの設定
export const STUDY_TYPES = [
    {
        id: 'vocabulary',
        name: '英語語彙',
        description: '英単語と日本語の対応を学習します',
    },
    {
        id: 'geography',
        name: '地理',
        description: '世界各国の国旗や国名を学習します',
    },
]

interface VocabularyRawData {
    id: number
    en: string
    ja: string
}

interface GeographyRawData {
    id: number
    iso: string
    ja: string
    flag: string
    pos: string
    url: string
    emoji: string
}

interface DatasetConfig<T> {
    id: string
    name: string
    description: string
    dataLoader: () => Promise<{ default: T[] }>
    processor: (data: T[]) => (Geography | Vocabulary)[]
}

export const VOCABULARY_DATASETS: DatasetConfig<VocabularyRawData>[] = [
    {
        id: '1',
        name: '英検1級',
        description: '英検1級レベルの英単語集',
        dataLoader: () => import('../data/vocabulary/vocabulary_1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data,
    },
    {
        id: 'listen_1',
        name: '英検1級リスニング',
        description: '英検1級レベルの英単語を音声で学習',
        dataLoader: () => import('../data/vocabulary/vocabulary_1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data,
    },
    {
        id: 'jun1',
        name: '英検準1級',
        description: '英検準1級レベルの英単語集',
        dataLoader: () => import('../data/vocabulary/vocabulary_jun1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data,
    },
    {
        id: 'listen_jun1',
        name: '英検準1級リスニング',
        description: '英検準1級レベルの英単語を音声で学習',
        dataLoader: () => import('../data/vocabulary/vocabulary_jun1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data,
    }
]

export const GEOGRAPHY_DATASETS: DatasetConfig<GeographyRawData>[] = [
    {
        id: 'flag',
        name: '世界の国旗',
        description: '世界各国の国旗と国名を学習します',
        dataLoader: () => import('../data/geography/wiki.json'),
        processor: (data: GeographyRawData[]): Geography[] => data,
    },
    {
        id: 'location',
        name: '世界の国の位置',
        description: '世界各国の位置と国名を学習します',
        dataLoader: () => import('../data/geography/wiki.json'),
        processor: (data: GeographyRawData[]): Geography[] => data,
    },
    {
        id: 'memo',
        name: 'メモ',
        description: '暗記において役立つかも知れないメモです',
        processor: () => [],
        dataLoader: async () => ({ default: [] }),
    }
]

// 統合された設定マップ
export const STUDY_CONFIG = {
    vocabulary: {
        type: STUDY_TYPES[0],
        datasets: VOCABULARY_DATASETS,
    },
    geography: {
        type: STUDY_TYPES[1],
        datasets: GEOGRAPHY_DATASETS,
    },
} as const

export type StudyType = keyof typeof STUDY_CONFIG