import { useParams, Navigate } from 'react-router-dom'

export const VocabularyPage = () => {
    const { datasetId } = useParams<{ datasetId: string }>()

    // 新しい統合ルートにリダイレクト
    return <Navigate to={`/study/vocabulary/${datasetId}`} replace />
}