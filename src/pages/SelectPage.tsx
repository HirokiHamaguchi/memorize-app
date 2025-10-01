import { useNavigate, useParams } from 'react-router-dom'
import { Selector } from '../components/Selector'
import { STUDY_TYPES, VOCABULARY_DATASETS, FLAGS_DATASETS } from '../config/constant'

export const SelectPage = () => {
    const navigate = useNavigate()
    const { type } = useParams<{ type?: string }>()

    if (type === 'vocabulary') { // 語彙セレクターページの設定
        return (
            <Selector
                subtitle="学習したい語彙データセットを選択してください"
                options={VOCABULARY_DATASETS}
                onSelect={(datasetId: string) => navigate(`/study/vocabulary/${datasetId}`)}
                showLoginSection={false}
            />
        )
    } else if (type === 'flags') { // 国旗セレクターページの設定
        return (
            <Selector
                subtitle="学習したい国旗データセットを選択してください"
                options={FLAGS_DATASETS}
                onSelect={(datasetId: string) => navigate(`/study/flags/${datasetId}`)}
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