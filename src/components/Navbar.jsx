import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // icons for menu

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollTo = (id) => {
    setIsOpen(false); // close menu on click
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (path) => {
    setIsOpen(false); // close menu
    navigate(path);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white sticky top-0 z-50">
      <div
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text cursor-pointer"
        onClick={() => handleNavigate('/')}
      >
        MoodMigo
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-4">
        <button onClick={() => handleNavigate('/')} className="text-gray-700 hover:text-purple-600">Home</button>
        <button onClick={() => handleScrollTo('services')} className="text-gray-700 hover:text-purple-600">Services</button>
        <button onClick={() => handleScrollTo('about')} className="text-gray-700 hover:text-purple-600">About</button>
        <button onClick={() => handleNavigate('/login')} className="text-gray-700 hover:text-purple-600">Login</button>
        <button onClick={() => handleNavigate('/signup')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full">Sign Up</button>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 right-6 bg-white shadow-md rounded-lg flex flex-col p-4 space-y-3 md:hidden z-50">
          <button onClick={() => handleNavigate('/')} className="text-gray-700 hover:text-purple-600">Home</button>
          <button onClick={() => handleScrollTo('services')} className="text-gray-700 hover:text-purple-600">Services</button>
          <button onClick={() => handleScrollTo('about')} className="text-gray-700 hover:text-purple-600">About</button>
          <button onClick={() => handleNavigate('/login')} className="text-gray-700 hover:text-purple-600">Login</button>
          <button onClick={() => handleNavigate('/signup')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full">Sign Up</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
