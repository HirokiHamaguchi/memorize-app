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

// 語彙学習の種類
export const VOCABULARY_STUDY_TYPES = [
    {
        id: 'normal',
        name: '通常の学習',
        description: '英単語と日本語の対応を暗記学習します',
    },
    {
        id: 'listen',
        name: 'リスニング',
        description: '英単語を音声で聞いて学習します',
    },
    {
        id: 'memo',
        name: 'メモ',
        description: '暗記において役立つかも知れないメモです',
    },
]

// 通常の語彙データセット
export const VOCABULARY_NORMAL_DATASETS: DatasetConfig<VocabularyRawData>[] = [
    {
        id: '1',
        name: '英検1級',
        description: '英検1級レベルの英単語集',
        dataLoader: () => import('../data/vocabulary/vocabulary_1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data,
    },
    {
        id: 'jun1',
        name: '英検準1級',
        description: '英検準1級レベルの英単語集',
        dataLoader: () => import('../data/vocabulary/vocabulary_jun1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data,
    }
]

// リスニング用語彙データセット
export const VOCABULARY_LISTEN_DATASETS: DatasetConfig<VocabularyRawData>[] = [
    {
        id: '1',
        name: '英検1級',
        description: '英検1級レベルの英単語を音声で学習',
        dataLoader: () => import('../data/vocabulary/vocabulary_1.json'),
        processor: (data: VocabularyRawData[]): Vocabulary[] => data,
    },
    {
        id: 'jun1',
        name: '英検準1級',
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
        studyTypes: VOCABULARY_STUDY_TYPES,
        normalDatasets: VOCABULARY_NORMAL_DATASETS,
        listenDatasets: VOCABULARY_LISTEN_DATASETS,
    },
    geography: {
        type: STUDY_TYPES[1],
        datasets: GEOGRAPHY_DATASETS,
    },
} as const

export type StudyType = keyof typeof STUDY_CONFIG