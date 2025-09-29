import { useNavigate } from 'react-router-dom'
import { DatasetSelector } from '../components/DatasetSelector'
import type { DatasetOption } from '../components/DatasetSelector'

export const SelectPage = () => {
    const navigate = useNavigate()

    // データセットの定義
    const datasets: DatasetOption[] = [
        {
            id: 'vocabulary_1',
            name: '1級',
            description: '英検1級レベルの英単語集',
        },
        {
            id: 'vocabulary_jun1',
            name: '準1級',
            description: '英検準1級レベルの英単語集',
        }
    ]

    return (
        <DatasetSelector
            datasets={datasets}
            onSelect={(datasetId: string) => navigate(`/study/${datasetId}`)}
            onBack={() => navigate(0)}
        />
    )
}