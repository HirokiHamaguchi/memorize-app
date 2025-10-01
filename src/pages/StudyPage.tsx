import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { StudyApp } from '../components/StudyApp'
import { STUDY_CONFIG, type StudyType } from '../config/constant'
import type { Flag, Vocabulary } from '../types/type'

type StudyDataItem = Flag | Vocabulary

export const StudyPage = () => {
    const { studyType, datasetId } = useParams<{ studyType: string; datasetId: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<StudyDataItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [rowHeight, setRowHeight] = useState(38)

    // 動的にデータセットを読み込む
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)

                // 学習タイプが有効かチェック
                if (!studyType || !(studyType in STUDY_CONFIG)) {
                    console.error('Invalid study type')
                    navigate('/')
                    return
                }

                const config = STUDY_CONFIG[studyType as StudyType]
                const dataset = config.datasets.find(ds => ds.id === datasetId)

                if (!dataset) {
                    console.error('Invalid dataset ID')
                    navigate(`/select/${studyType}`)
                    return
                }

                // 行の高さを設定
                setRowHeight(config.type.rowHeight)

                // データを読み込み
                const module = await dataset.dataLoader()
                const rawData = module.default
                const processedData = dataset.processor(rawData as never)

                setData(processedData)
            } catch (error) {
                console.error('Failed to load data:', error)
                navigate(`/select/${studyType}`)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [studyType, datasetId, navigate])

    // ローディング中の表示
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>データを読み込み中...</div>
            </div>
        )
    }

    return (
        <StudyApp
            data={data}
            rowHeight={rowHeight}
        />
    )
}