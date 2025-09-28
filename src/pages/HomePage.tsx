import { useNavigate } from 'react-router-dom'
import { DatasetSelector } from '../components/DatasetSelector'
import type { DatasetOption } from '../components/DatasetSelector'
import vocabularyData_1 from '../../data/vocabulary_1.json'
import vocabularyData_jun1 from '../../data/vocabulary_jun1.json'

export const HomePage = () => {
    const navigate = useNavigate()

    // データセットの定義
    const datasets: DatasetOption[] = [
        {
            id: 'vocabulary_1',
            name: '1級',
            description: '英検1級レベルの英単語集',
            count: vocabularyData_1.length
        },
        {
            id: 'vocabulary_jun1',
            name: '準1級',
            description: '英検準1級レベルの英単語集',
            count: vocabularyData_jun1.length
        }
    ]

    const handleDatasetSelect = (datasetId: string) => {
        navigate(`/study/${datasetId}`)
    }

    return (
        <DatasetSelector
            datasets={datasets}
            onSelect={handleDatasetSelect}
        />
    )
}