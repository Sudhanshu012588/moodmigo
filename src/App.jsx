import { useState } from 'react'
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Navbar from './components/Navbar'
import './App.css'
import Homepage from './pages/Homepage'
import Login from './pages/Login';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path='/login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
