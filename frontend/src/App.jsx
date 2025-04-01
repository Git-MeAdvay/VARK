import NavBar from './components/NavBar'
import Home from './pages/Home'
import StudentForm from './pages/new'
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
        </Routes>
    </BrowserRouter>
  )
}

export default App
