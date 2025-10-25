import { useNavigate, useParams } from 'react-router-dom'
import { Selector } from '../components/Selector'
import {
    STUDY_TYPES,
    VOCABULARY_STUDY_TYPES,
    VOCABULARY_NORMAL_DATASETS,
    VOCABULARY_LISTEN_DATASETS,
    GEOGRAPHY_DATASETS
} from '../config/constant'

export const SelectPage = () => {
    const navigate = useNavigate()
    const { studyType, vocabularyType } = useParams<{
        studyType?: string
        vocabularyType?: string
    }>()

    if (studyType === 'vocabulary') {
        if (vocabularyType === 'normal') {
            // 通常の語彙学習のデータセット選択
            return (
                <Selector
                    subtitle="学習したい語彙データセットを選択してください"
                    options={VOCABULARY_NORMAL_DATASETS}
                    onSelect={(datasetId: string) => {
                        navigate(`/study/vocabulary/${datasetId}`)
                    }}
                />
            )
        } else if (vocabularyType === 'listen') {
            // リスニング用語彙学習のデータセット選択
            return (
                <Selector
                    subtitle="学習したい語彙データセットを選択してください"
                    options={VOCABULARY_LISTEN_DATASETS}
                    onSelect={(datasetId: string) => {
                        navigate(`/study/vocabulary/listen/${datasetId}`)
                    }}
                />
            )
        } else if (vocabularyType === 'memo') {
            // メモページに直接遷移
            navigate('/study/vocabulary/memo')
            return null
        } else {
            // 語彙学習の種類選択（通常 or リスニング or メモ）
            return (
                <Selector
                    subtitle="語彙学習の種類を選択してください"
                    options={VOCABULARY_STUDY_TYPES}
                    onSelect={(typeId: string) => navigate(`/select/vocabulary/${typeId}`)}
                />
            )
        }
    } else if (studyType === 'geography') {
        // 地理セレクターページの設定
        return (
            <Selector
                subtitle="学習したい地理データセットを選択してください"
                options={GEOGRAPHY_DATASETS}
                onSelect={(datasetId: string) => navigate(`/study/geography/${datasetId}`)}
            />
        )
    } else {
        // メインの学習タイプ選択
        return (
            <Selector
                subtitle="学習したい内容を選択してください"
                options={STUDY_TYPES}
                onSelect={(typeId: string) => navigate(`/select/${typeId}`)}
            />
        )
    }
}