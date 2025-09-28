import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SelectPage, StudyPage } from './pages'
import './App.css'

function App() {
  return (
    <Router basename="/vocabulary-app">
      <Routes>
        <Route index element={<SelectPage />} />
        <Route path="/select" element={<SelectPage />} />
        <Route path="/study/:datasetId" element={<StudyPage />} />
      </Routes>
    </Router>
  )
}

export default App
