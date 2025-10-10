import { useNavigate, useParams } from 'react-router-dom'
import { Selector } from '../components/Selector'
import { STUDY_TYPES, VOCABULARY_DATASETS, GEOGRAPHY_DATASETS } from '../config/constant'

export const SelectPage = () => {
    const navigate = useNavigate()
    const { studyType } = useParams<{ studyType?: string }>()

    if (studyType === 'vocabulary') { // 語彙セレクターページの設定
        return (
            <Selector
                subtitle="学習したい語彙データセットを選択してください"
                options={VOCABULARY_DATASETS}
                onSelect={(datasetId: string) => navigate(`/study/vocabulary/${datasetId}`)}
                showLoginSection={false}
            />
        )
    } else if (studyType === 'geography') { // 地理セレクターページの設定
        return (
            <Selector
                subtitle="学習したい地理データセットを選択してください"
                options={GEOGRAPHY_DATASETS}
                onSelect={(datasetId: string) => navigate(`/study/geography/${datasetId}`)}
                showLoginSection={false}
            />
        )
    } else {
        return (
            <Selector
                subtitle="学習したい内容を選択してください"
                options={STUDY_TYPES}
                onSelect={(typeId: string) => navigate(`/select/${typeId}`)}
                showLoginSection={true}
            />
        )

    }
}