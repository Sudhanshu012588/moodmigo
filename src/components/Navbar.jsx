import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
      {/* Logo */}
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
        Mentaid
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <a href="#" className="text-gray-700 hover:text-purple-600">Home</a>
        <a href="#" className="text-gray-700 hover:text-purple-600">Services</a>
        <a href="#" className="text-gray-700 hover:text-purple-600">About</a>
        <a href="#" className="text-gray-700 hover:text-purple-600">Login</a>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
