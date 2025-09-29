import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SelectPage, StudyPage } from './pages'
import './App.css'

// ページごとのbodyクラスを管理するコンポーネント
function BodyClassManager() {
  const location = useLocation()

  useEffect(() => {
    document.body.classList.remove('page-select', 'page-study')
    if (location.pathname === '/' || location.pathname === '/select') {
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
    <Router basename="/vocabulary-app">
      <BodyClassManager />
      <Routes>
        <Route index element={<SelectPage />} />
        <Route path="/select" element={<SelectPage />} />
        <Route path="/study/:datasetId" element={<StudyPage />} />
      </Routes>
    </Router>
  )
}

export default App
