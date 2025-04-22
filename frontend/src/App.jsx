import NavBar from './components/NavBar'
import Home from './pages/Home'
import StudentForm from './pages/StudentForm'
import New from './pages/ILS'
import TeacherDashboard from './pages/TeacherDashboard';
import Sign from './pages/Sign'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {

  const [language, setLanguage] = useState('en'); // 'en' for English, 'mr' for Marathi

  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<><NavBar language={language} setLanguage={setLanguage} disable={false} /><Home language={language} /></>} />
        <Route path="/sign" element={<><NavBar language={language} setLanguage={setLanguage} disable={true} /><Sign language={language} /></>} />
        <Route path="/form" element={<><NavBar language={language} setLanguage={setLanguage} disable={true} /><StudentForm language={language} /></>} />
        <Route path="/ils" element={<><NavBar title="ILS" language={language} setLanguage={setLanguage} disable={true} /><New language={language} /></>}  />
        <Route path="/dashboard" element={<TeacherDashboard language={language} />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
