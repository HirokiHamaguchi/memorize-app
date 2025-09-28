import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage, StudyPage } from './pages'
import './App.css'

function App() {
  return (
    <Router basename="/vocabulary-app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study/:datasetId" element={<StudyPage />} />
      </Routes>
    </Router>
  )
}

export default App
