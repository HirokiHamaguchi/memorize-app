import { useNavigate } from 'react-router-dom'
import { Selector } from '../components/Selector'
import type { SelectorOption } from '../components/Selector'

export const FlagsSelectPage = () => {
    const navigate = useNavigate()

    // 国旗データセットの定義
    const flagsDatasets: SelectorOption[] = [
        {
            id: 'world',
            name: '世界の国旗',
            description: '世界各国の国旗と国名を学習します',
        }
    ]

    return (
        <Selector
            subtitle="学習したい国旗データセットを選択してください"
            options={flagsDatasets}
            onSelect={(datasetId: string) => navigate(`/study/flags/${datasetId}`)}
            showLoginSection={false}
        />
    )
}