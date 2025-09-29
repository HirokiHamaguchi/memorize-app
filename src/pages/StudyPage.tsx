import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { VocabularyApp } from '../components/VocabularyApp'
import type { Vocabulary } from '../types/vocabulary'

export const StudyPage = () => {
    const { datasetId } = useParams<{ datasetId: string }>()
    const navigate = useNavigate()
    const [vocabularyData, setVocabularyData] = useState<Vocabulary[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // 動的にデータセットを読み込む
    useEffect(() => {
        const loadVocabularyData = async () => {
            try {
                setIsLoading(true)
                let data: { id: number; en: string; ja: string }[]

                switch (datasetId) {
                    case 'vocabulary_1': {
                        const module1 = await import('../../data/vocabulary/vocabulary_1.json')
                        data = module1.default
                        break
                    }
                    case 'vocabulary_jun1': {
                        const module2 = await import('../../data/vocabulary/vocabulary_jun1.json')
                        data = module2.default
                        break
                    }
                    default:
                        console.error('Invalid dataset ID')
                        navigate('/')
                        return
                }

                const processedData = data.map(item => ({ ...item, id: String(item.id) })) as Vocabulary[]
                setVocabularyData(processedData)
            } catch (error) {
                console.error('Failed to load vocabulary data:', error)
                navigate('/')
            } finally {
                setIsLoading(false)
            }
        }

        loadVocabularyData()
    }, [datasetId, navigate])

    const handleBackToSelect = () => {
        navigate('/select')
    }

    // ローディング中の表示
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>データを読み込み中...</div>
            </div>
        )
    }

    return (
        <VocabularyApp
            vocabularyData={vocabularyData}
            onBack={handleBackToSelect}
        />
    )
}