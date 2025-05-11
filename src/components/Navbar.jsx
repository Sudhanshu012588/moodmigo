import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // wait for navigation to homepage
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
      <div
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text cursor-pointer"
        onClick={() => navigate('/')}
      >
        MoodMigo
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/')} className="text-gray-700 hover:text-purple-600">Home</button>
        <button onClick={() => handleScrollTo('services')} className="text-gray-700 hover:text-purple-600">Services</button>
        <button onClick={() => handleScrollTo('about')} className="text-gray-700 hover:text-purple-600">About</button>
        <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-purple-600">Login</button>
        <button onClick={() => navigate('/signup')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
