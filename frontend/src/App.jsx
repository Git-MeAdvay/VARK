import NavBar from './components/NavBar'
import Home from './pages/Home'
import StudentForm from './pages/StudentForm'
import New from './pages/new'
import TeacherDashboard from './pages/TeacherDashboard';
import Sign from './pages/Sign'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<><NavBar /><Home /></>} />
        <Route path="/sign" element={<><Sign /></>} />
        <Route path="/form" element={<StudentForm />} />
        <Route path="/test" element={<New />} />
        <Route path="/dashboard" element={<TeacherDashboard />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
