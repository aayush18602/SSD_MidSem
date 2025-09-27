import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/Admin.jsx';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/signin" element={<SignIn />} />  
        <Route path="/signup" element={<SignUp />} />  
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
