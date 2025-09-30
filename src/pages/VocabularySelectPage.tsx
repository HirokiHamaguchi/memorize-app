import { useNavigate } from 'react-router-dom'
import { Selector } from '../components/Selector'
import type { SelectorOption } from '../components/Selector'

export const VocabularySelectPage = () => {
    const navigate = useNavigate()

    // 語彙データセットの定義
    const vocabularyDatasets: SelectorOption[] = [
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

    return (
        <Selector
            subtitle="学習したい語彙データセットを選択してください"
            options={vocabularyDatasets}
            onSelect={(datasetId: string) => navigate(`/study/vocabulary/${datasetId}`)}
            showLoginSection={false}
        />
    )
}