// App.jsx
import React, { useEffect,useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Also include this CSS
import ProfessionalDashboard from "./pages/ProffesionalDashboard";
import Homepage from "./pages/Homepage";
import { useStore } from "./store/store";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Manas from "./pages/Manas";
import Signup from "./pages/Signup";
import BlogPage from "./pages/BlogPage";
import MentorBooking from "./pages/BookSession"
import MoodMigoQuestionnaire from "./pages/Questions";
import JournalEntry from "./pages/JournalEntry";
const App = () => {
  const type = useStore((state)=>state.type)

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
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/mentorsdashboard" element={<ProfessionalDashboard/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/sessions" element={<MentorBooking/>}/>
            <Route path="/chat" element={<Manas />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/questionnaire" element={<MoodMigoQuestionnaire />} />
            <Route path="/journal" element={<JournalEntry/>}/>
            <Route path="/signup" element={<Signup/>}/>
          </Routes>
      </BrowserRouter>
          </>
  );
};

export default App;
