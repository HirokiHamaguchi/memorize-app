import { useParams, Navigate } from 'react-router-dom'

export const FlagsPage = () => {
    const { datasetId } = useParams<{ datasetId: string }>()

    // 新しい統合ルートにリダイレクト
    return <Navigate to={`/study/flags/${datasetId}`} replace />
}