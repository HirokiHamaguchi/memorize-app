import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import {
  SelectPage,
  VocabularySelectPage,
  FlagsSelectPage,
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
        <Route path="/select/vocabulary" element={<VocabularySelectPage />} />
        <Route path="/select/flags" element={<FlagsSelectPage />} />
        <Route path="/study/vocabulary/:datasetId" element={<VocabularyPage />} />
        <Route path="/study/flags/:datasetId" element={<FlagsPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
