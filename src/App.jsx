// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Also include this CSS

import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Manas from "./pages/Manas";
import Signup from "./pages/Signup";
import BlogPage from "./pages/BlogPage";
const App = () => {
  return (
    <>
     <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
  toastClassName={() =>
    "bg-gray-900 text-white rounded-lg shadow-lg px-4 py-3 border border-gray-700"
  }
  bodyClassName={() => "text-sm font-medium"}
  progressClassName="bg-green-400"
/>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route
          path="/dashboard"
          element={<Dashboard/>}
          />

        <Route
          path="/login"
          element={<Login />}
          />

        <Route
          path="/signup"
          element={ <Signup />}
        />
      <Route path="/blog" element={<BlogPage/>}/>
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/manas" element={<Manas />} />
      </Routes>
    </BrowserRouter>
          </>
  );
};

export default App;
