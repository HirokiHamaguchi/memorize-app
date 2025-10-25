import { useState, useEffect, useCallback } from 'react'

// 定数
const SECTIONS_COUNT = 50

// カスタムフック：データフィルタリング
export const useDataFiltering = <T>(allData: T[]) => {
    const [selectedSection, setSelectedSection] = useState<number | null>(null)
    const [filteredData, setFilteredData] = useState<T[]>([])

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