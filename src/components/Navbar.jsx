import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import { account } from '../appwrite/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useStore((state) => state.User.isLoggedIn);

  const [isOpen, setIsOpen] = useState(true); // Always true to always show bottom nav on mobile

  const handleScrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (path) => {
    if (isLoggedIn && path === '/') {
      navigate('/dashboard');
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    useStore.setState({ User: { isLoggedIn: false } });
    account.deleteSession('current')
      .then(() => {
        toast.success('Logged out successfully!');
        navigate('/');
      })
      .catch(() => {
        toast.error('Logout failed. Try again.');
      });
  };

  // Render nothing on desktop
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return null;

  return (
    isOpen && (
      <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white z-50 py-3 px-6 flex justify-around items-center shadow-lg rounded-full md:hidden">
        <div className="flex flex-col items-center" onClick={() => handleNavigate('/')}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 
              3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-xs">Home</span>
        </div>

        <div className="flex flex-col items-center" onClick={() => handleScrollTo('services')}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 19V6h13v13H9zM4 6H2v13h2V6zm0 0h2v13H4z" />
          </svg>
          <span className="text-xs">Services</span>
        </div>

        <div className="flex flex-col items-center" onClick={() => handleScrollTo('about')}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 20h9" />
            <path d="M16.5 3a4.5 4.5 0 0 1 0 9m-9-9a4.5 4.5 0 0 1 0 9m0 6a4.5 4.5 0 0 1 9 0" />
          </svg>
          <span className="text-xs">About</span>
        </div>

        <div
          className="flex flex-col items-center"
          onClick={() => isLoggedIn ? handleLogout() : handleNavigate('/login')}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
            <path d="M3 4v16h18" />
          </svg>
          <span className="text-xs">{isLoggedIn ? 'Logout' : 'Login'}</span>
        </div>
      </div>
    )
  );
};

export default Navbar;
