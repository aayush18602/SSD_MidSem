import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx'
import CourseDetails from './pages/CourseDetails.jsx'


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
