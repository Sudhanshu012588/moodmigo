import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import './App.css'
import Homepage from './pages/Homepage'
import Login from './pages/Login';
import Signup from './pages/Signup';  
import Dashboard from './pages/Dashboard';


function App() {
  const token = localStorage.getItem("token");
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Homepage/>} />
          {token ? <Route path='login' element={<Dashboard/>} /> : <Route path='login' element={<Login/>} />}
          {token ? <Route path='signup' element={<Dashboard/>} /> : <Route path='signup' element={<Signup/>} />}
         

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
