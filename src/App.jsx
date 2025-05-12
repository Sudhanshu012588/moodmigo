import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />

      
        {/* Redirect to dashboard if already logged in */}
        <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={token ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        {token?<Route path="/dashboard" element={<Dashboard />} />:null}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
