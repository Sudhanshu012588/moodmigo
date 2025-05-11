import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import './App.css'
import Homepage from './pages/Homepage'
import Login from './pages/Login';
import Signup from './pages/Signup';  
import Dashboard from './pages/Dashboard';
import PrivateRoute from "./utils/PrivateRoute";

import { AuthProvider } from "./utils/AuthContyext";
function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/dashboard' element={<Dashboard/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
