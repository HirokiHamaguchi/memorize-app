import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FlagsApp } from '../components/FlagsApp'
import type { Flag } from '../types/flags'

export const FlagsPage = () => {
    const { datasetId } = useParams<{ datasetId: string }>()
    const navigate = useNavigate()
    const [flagsData, setFlagsData] = useState<Flag[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // フラグデータを読み込む
    useEffect(() => {
        const loadFlagsData = async () => {
            try {
                setIsLoading(true)

                // データセットIDのバリデーション
                if (datasetId !== 'world') {
                    console.error('Invalid dataset ID for flags')
                    navigate('/select/flags')
                    return
                }

                // _iso2ja.jsonを読み込み
                const module = await import('../../data/flags/_iso2ja.json')
                const iso2jaData = module.default

                // フラグデータを作成
                const flagsArray: Flag[] = Object.entries(iso2jaData).map(([code, jaName], index) => ({
                    id: String(index + 1),
                    code: code,
                    ja: jaName as string,
                    svg: `/memorize-app/data/flags/${code}.svg`
                }))

                setFlagsData(flagsArray)
            } catch (error) {
                console.error('Failed to load flags data:', error)
                navigate('/select/flags')
            } finally {
                setIsLoading(false)
            }
        }

        loadFlagsData()
    }, [datasetId, navigate])

    // ローディング中の表示
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>データを読み込み中...</div>
            </div>
        )
    }

    return (
        <FlagsApp
            flagsData={flagsData}
        />
    )
}