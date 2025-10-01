import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import {
  SelectPage,
  VocabularyPage,
  FlagsPage
} from './pages'
import './App.css'

// ページごとのbodyクラスを管理するコンポーネント
function BodyClassManager() {
  const location = useLocation()

  useEffect(() => {
    document.body.classList.remove('page-select', 'page-study')
    if (location.pathname === '/' || location.pathname.startsWith('/select')) {
      document.body.classList.add('page-select')
    } else if (location.pathname.startsWith('/study/')) {
      document.body.classList.add('page-study')
    }
    return () => {
      document.body.classList.remove('page-select', 'page-study')
    }
  }, [location.pathname])

  return null
}

function App() {
  return (
    <Router basename="/memorize-app">
      <BodyClassManager />
      <Routes>
        <Route index element={<SelectPage />} />
        <Route path="/select" element={<SelectPage />} />
        <Route path="/select/:type" element={<SelectPage />} />
        <Route path="/study/vocabulary/:datasetId" element={<VocabularyPage />} />
        <Route path="/study/flags/:datasetId" element={<FlagsPage />} />
      </Routes>
    </Router>
  )
}

export default App
