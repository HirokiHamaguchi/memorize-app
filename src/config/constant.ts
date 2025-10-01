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
    },
    {
        id: 'flags',
        name: '国旗',
        description: '世界各国の国旗と国名を学習します',
    }
]

export const VOCABULARY_DATASETS = [
    {
        id: '1',
        name: '英検1級',
        description: '英検1級レベルの英単語集',
    },
    {
        id: 'jun1',
        name: '英検準1級',
        description: '英検準1級レベルの英単語集',
    }
]

export const FLAGS_DATASETS = [
    {
        id: 'world',
        name: '世界の国旗',
        description: '世界各国の国旗と国名を学習します',
    }
]