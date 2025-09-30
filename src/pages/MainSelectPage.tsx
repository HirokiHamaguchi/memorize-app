import { useNavigate } from 'react-router-dom'
import { Selector } from '../components/Selector'
import type { SelectorOption } from '../components/Selector'

export const MainSelectPage = () => {
    const navigate = useNavigate()

    // 学習タイプの定義
    const studyTypes: SelectorOption[] = [
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

    return (
        <Selector
            subtitle="学習したい内容を選択してください"
            options={studyTypes}
            onSelect={(typeId: string) => navigate(`/select/${typeId}`)}
            showLoginSection={true}
        />
    )
}