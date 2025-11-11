import type { Geography, Vocabulary } from '../types/type'

export const HEADER_HEIGHT = 70 // ヘッダーの高さ(px)
export const SELECT_HEADER_HEIGHT = 90 // ヘッダーの高さ(px)
export const MINIMUM_TOUCH_SCROLL = 5 // 最小タッチスクロール量
export const SECTIONS_COUNT = 50 // セクション数

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

interface DatasetConfig<T> {
    id: string
    name: string
    description: string
    dataLoader: (section?: number) => Promise<{ default: T[] }>
    processor: (data: T[]) => (Geography | Vocabulary)[]
}

// セクション別データローダーを生成するヘルパー関数
function createSectionDataLoader(datasetId: string) {
    return (section?: number) => {
        if (section === undefined) {
            // セクション指定なしの場合は全データを読み込む
            return import(`../data/vocabulary/vocabulary_${datasetId}.json`)
        }
        // セクション指定がある場合はそのセクションのみ読み込む
        return import(`../data/vocabulary/vocabulary_${datasetId}_section${section}.json`)
    }
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
export const VOCABULARY_NORMAL_DATASETS: DatasetConfig<Vocabulary>[] = [
    {
        id: '1',
        name: '英検1級',
        description: '英検1級レベルの英単語集',
        dataLoader: createSectionDataLoader('1'),
        processor: (data: Vocabulary[]): Vocabulary[] => data,
    },
    {
        id: 'jun1',
        name: '英検準1級',
        description: '英検準1級レベルの英単語集',
        dataLoader: createSectionDataLoader('jun1'),
        processor: (data: Vocabulary[]): Vocabulary[] => data,
    }
]

// リスニング用語彙データセット
export const VOCABULARY_LISTEN_DATASETS: DatasetConfig<Vocabulary>[] = [
    {
        id: '1',
        name: '英検1級',
        description: '英検1級レベルの英単語を音声で学習',
        dataLoader: createSectionDataLoader('1'),
        processor: (data: Vocabulary[]): Vocabulary[] => data,
    },
    {
        id: 'jun1',
        name: '英検準1級',
        description: '英検準1級レベルの英単語を音声で学習',
        dataLoader: createSectionDataLoader('jun1'),
        processor: (data: Vocabulary[]): Vocabulary[] => data,
    }
]

export const GEOGRAPHY_DATASETS: DatasetConfig<Geography>[] = [
    {
        id: 'flag',
        name: '世界の国旗',
        description: '世界各国の国旗と国名を学習します',
        dataLoader: () => import('../data/geography/wiki.json'),
        processor: (data: Geography[]): Geography[] => data,
    },
    {
        id: 'location',
        name: '世界の国の位置',
        description: '世界各国の位置と国名を学習します',
        dataLoader: () => import('../data/geography/wiki.json'),
        processor: (data: Geography[]): Geography[] => data,
    },
    {
        id: 'capital',
        name: '世界の首都',
        description: '世界各国の国名から首都を学習します',
        dataLoader: () => import('../data/geography/wiki.json'),
        processor: (data: Geography[]): Geography[] => data,
    },
    {
        id: 'memo',
        name: 'メモ',
        description: '暗記において役立つかも知れないメモです',
        processor: () => [],
        dataLoader: () => Promise.resolve({ default: [] }),
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