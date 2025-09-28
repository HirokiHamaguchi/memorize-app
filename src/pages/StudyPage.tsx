import { useParams, useNavigate } from 'react-router-dom'
import { VocabularyApp } from '../components/VocabularyApp'
import type { Vocabulary } from '../types/vocabulary'
import vocabularyData_1 from '../../data/vocabulary_1.json'
import vocabularyData_jun1 from '../../data/vocabulary_jun1.json'

export const StudyPage = () => {
    const { datasetId } = useParams<{ datasetId: string }>()
    const navigate = useNavigate()

    // 選択されたデータセットの語彙データを取得
    const getVocabularyData = (): Vocabulary[] => {
        switch (datasetId) {
            case 'vocabulary_1':
                return vocabularyData_1 as Vocabulary[]
            case 'vocabulary_jun1':
                return vocabularyData_jun1 as Vocabulary[]
            default:
                // 無効なデータセットIDの場合はホームページにリダイレクト
                navigate('/')
                return []
        }
    }

    const handleBackToHome = () => {
        navigate('/')
    }

    return (
        <VocabularyApp
            vocabularyData={getVocabularyData()}
            onBack={handleBackToHome}
        />
    )
}