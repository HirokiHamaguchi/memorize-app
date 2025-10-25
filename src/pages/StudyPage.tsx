import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Box, Text, VStack } from '@chakra-ui/react'
import { StudyApp } from '../components/StudyApp'
import { STUDY_CONFIG, type StudyType } from '../config/constant'
import type { Geography, Vocabulary } from '../types/type'

type StudyDataItem = Geography | Vocabulary

// 定数
const SECTIONS_COUNT = 50
const ROW_HEIGHTS = {
    vocabulary: 38,
    geography_flag: 89,
    geography_location: 250,
    default: 100
} as const

// カスタムフック：データセット取得
const useDatasetConfig = (studyType: string, datasetId: string) => {
    const navigate = useNavigate()

    const getDatasetConfig = useCallback(() => {
        if (!studyType || !(studyType in STUDY_CONFIG)) {
            console.error('Invalid study type')
            navigate('/')
            return null
        }

        const config = STUDY_CONFIG[studyType as StudyType]

        if (studyType === 'vocabulary') {
            const vocabConfig = config as typeof STUDY_CONFIG.vocabulary
            return vocabConfig.normalDatasets.find(ds => ds.id === datasetId)
        } else {
            const geoConfig = config as typeof STUDY_CONFIG.geography
            return geoConfig.datasets.find(ds => ds.id === datasetId)
        }
    }, [studyType, datasetId, navigate])

    return getDatasetConfig
}

// カスタムフック：データロード
const useStudyData = (studyType: string, datasetId: string) => {
    const navigate = useNavigate()
    const getDatasetConfig = useDatasetConfig(studyType, datasetId)
    const [allData, setAllData] = useState<StudyDataItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const configKey = studyType === "vocabulary" ? studyType : `${studyType}_${datasetId}`
    const rowHeight = (ROW_HEIGHTS as Record<string, number>)[configKey] || ROW_HEIGHTS.default

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const dataset = getDatasetConfig()
                if (!dataset) {
                    setError('データセットが見つかりません')
                    navigate(`/select/${studyType}`)
                    return
                }

                const module = await dataset.dataLoader()
                const rawData = module.default
                const processedData = dataset.processor(rawData as never)

                setAllData(processedData)
            } catch (err) {
                console.error('Failed to load data:', err)
                setError('データの読み込みに失敗しました')
                navigate(`/select/${studyType}`)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [studyType, datasetId, getDatasetConfig, navigate])

    return { allData, isLoading, error, rowHeight, configKey }
}

// カスタムフック：データフィルタリング
const useDataFiltering = (allData: StudyDataItem[]) => {
    const [selectedSection, setSelectedSection] = useState<number | null>(null)
    const [filteredData, setFilteredData] = useState<StudyDataItem[]>([])

    useEffect(() => {
        if (selectedSection === null) {
            setFilteredData(allData)
        } else {
            const filtered = allData.filter((_, index) => index % SECTIONS_COUNT === selectedSection - 1)
            setFilteredData(filtered)
        }
    }, [selectedSection, allData])

    const handleSectionChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        setSelectedSection(value === '' ? null : parseInt(value))
    }, [])

    return { selectedSection, filteredData, handleSectionChange }
}

// コンポーネント：ローディング画面
const LoadingScreen = () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text>データを読み込み中...</Text>
    </Box>
)

// コンポーネント：区分選択画面
interface SectionSelectorProps {
    selectedSection: number | null
    onSectionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const SectionSelector = ({ selectedSection, onSectionChange }: SectionSelectorProps) => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
        py={8}
        minHeight="100vh"
    >
        <VStack gap={4} maxW="400px" w="full">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
                学習する区分を選択してください
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
                1〜{SECTIONS_COUNT}の区分から選択してください
            </Text>
            <select
                value={selectedSection || ''}
                onChange={onSectionChange}
                style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: '2px solid #E2E8F0',
                    width: '100%'
                }}
            >
                <option value="">区分を選択</option>
                {Array.from({ length: SECTIONS_COUNT }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                        区分 {num}
                    </option>
                ))}
            </select>
        </VStack>
    </Box>
)

// メインコンポーネント
export const StudyPage = () => {
    const { studyType, datasetId } = useParams<{ studyType: string; datasetId: string }>()

    // Hooksを条件なしで呼び出す
    const { allData, isLoading, error, rowHeight, configKey } = useStudyData(studyType || '', datasetId || '')
    const { selectedSection, filteredData, handleSectionChange } = useDataFiltering(allData)

    if (!studyType || !datasetId || isLoading) {
        return <LoadingScreen />
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Text color="red.500">{error}</Text>
            </Box>
        )
    }

    if (selectedSection === null) {
        return (
            <SectionSelector
                selectedSection={selectedSection}
                onSectionChange={handleSectionChange}
            />
        )
    } else {
        return (
            <StudyApp
                data={filteredData}
                rowHeight={rowHeight}
                configKey={configKey}
            />
        )
    }
}