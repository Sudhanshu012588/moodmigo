import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // icons for menu
import { useStore } from '../store/store'; // global state management
import { account } from '../appwrite/config'; // appwrite account for user management
import { toast } from 'react-toastify'; // toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // import toastify styles
import { Client,Account } from 'appwrite';
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  // Use Zustand's isLoggedIn state
  const isLoggedIn = useStore((state) => state.User.isLoggedIn);
  const User = useStore((state) => state.User);
    const setUser = useStore((state) => state.setUser);
  // Handle scroll to section
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
const checkSession = async () => {
      try {
        const client = new Client()
        .setEndpoint("https://fra.cloud.appwrite.io/v1").setProject(import.meta.env.VITE_PROJECT_ID)
        const account = new Account(client)
        const user = await account.get(); // if session cookie is valid, this works
        setUser({ isLoggedIn: true, details: user });
        console.log("User restored from Appwrite session:", user);
        setUser({
          id:user.$id,
          name:user.name,
          email: user.email,
          isLoggedIn: true,
          profilepicture:"",
          coverimage:""
        })
      } catch (err) {
        console.log("No active session:", err.message);
        // setUser({ isLoggedIn: false, details: null });
      }
    };
  
  useEffect(() => {
    if(!isLoggedIn){
      if(type == "Client"){
      checkSession();}
    }
  }, [])
  

  const userType = localStorage.getItem('type');
  // Handle navigation
  const handleNavigate = (path) => {
    setIsOpen(false); // close menu
    if (isLoggedIn && path === '/') {
      navigate(userType==="Client"? '/dashboard' : "/mentorsdashboard"); // Redirect to dashboard if logged in and trying to go to home
    } else {
      navigate(path);
    }
  };

  const type =localStorage.getItem('type')
  // Logout function
  const handleLogout = () => {
    // Remove token from localStorage
    // localStorage.removeItem('token');
    // localStorage.removeItem('type')
    // Update Zustand state
    useStore.setState({ User: { isLoggedIn: false } });
    // Delete session from Appwrite
    if(type == "Client"){
      account.deleteSession('current')
        .then(() => {
          console.log('Session deleted');
  
          // Show Toastify success message
          toast.success('Successfully logged out!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          localStorage.removeItem("token")
          // Navigate to home
          navigate('/');
        })
        .catch((error) => {
          console.error('Error deleting session:', error);
          
          
                  // Show error message in case of failure
                  toast.error('Error logging out. Please try again.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                });
    }else{
      try{

        const client = new Client();
        client.setEndpoint("https://fra.cloud.appwrite.io/v1")
        .setProject("6826c7d8002c4477cb81");
        const account = new Account(client)
        account.deleteSession('current')
        .then(() => {
          console.log('Session deleted');
  
          // Show Toastify success message
          toast.success('Successfully logged out!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // Navigate to home
                    localStorage.removeItem("token")

          navigate('/');})
      }catch(error){
        toast.error("logout failed",error)
      }
    }
  };

  // Handle MoodMigo click
  const handleMoodMigoClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard'); // Go to dashboard if logged in
    } else {
      navigate('/'); // Go to home if not logged in
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 mb-1  bg-white sticky top-0 z-50 ">
      <div
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text cursor-pointer"
        onClick={handleMoodMigoClick} // Use the new handler
      >
        MoodMigo
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-4">
        <button onClick={() => handleNavigate('/')} className="text-gray-700 hover:text-purple-600">
          {isLoggedIn ? 'Dashboard' : 'Home'}
        </button>
        <button onClick={() => handleScrollTo('services')} className="text-gray-700 hover:text-purple-600">Services</button>
        <button onClick={() => handleScrollTo('about')} className="text-gray-700 hover:text-purple-600">About</button>

        {/* Login/Logout Button */}
        <button
          onClick={() => {
            isLoggedIn ? handleLogout() : handleNavigate('/login');
          }}
          className="text-gray-700 hover:text-purple-600"
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>

        {/* Sign Up Button */}
        <button
          onClick={() => {
            isLoggedIn ? handleNavigate('/dashboard') : handleNavigate('/signup');
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full"
        >
          Sign Up
        </button>
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
          <button onClick={() => handleNavigate('/')} className="text-gray-700 hover:text-purple-600">
            {isLoggedIn ? 'Dashboard' : 'Home'}
          </button>
          <button onClick={() => handleScrollTo('services')} className="text-gray-700 hover:text-purple-600">Services</button>
          <button onClick={() => handleScrollTo('about')} className="text-gray-700 hover:text-purple-600">About</button>

          {/* Login/Logout Button */}
          <button
            onClick={() => {
              isLoggedIn ? handleLogout() : handleNavigate('/login');
            }}
            className="text-gray-700 hover:text-purple-600"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>

          {/* Sign Up Button */}
          <button
            onClick={() => {
              isLoggedIn ? handleNavigate('/dashboard') : handleNavigate('/signup');
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;