import React, { useEffect, useState } from 'react';

const LoginToggle = ({ onChange }) => {
  const [isClient, setIsClient] = useState();
  useEffect(()=>{
    const user = localStorage.getItem('type')
    if(!user){
      localStorage.setItem("type",'Client')
    }
    if(user==='Client')setIsClient(true)
      else setIsClient(false)
  },[])
  const handleClientClick = () => {
    setIsClient(true);
    localStorage.setItem('type', 'Client'); // ✅ Save in localStorage
    onChange && onChange('client');
  };

  const handleProfessionalClick = () => {
    setIsClient(false);
    localStorage.setItem('type', 'Professional'); // ✅ Save in localStorage
    onChange && onChange('professional');
  };

  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex w-72 bg-white/80 backdrop-blur-md border border-gray-300 rounded-full shadow-inner overflow-hidden">
        <button
          className={`w-1/2 py-2 text-sm font-medium transition-all duration-300 ${
            isClient
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={handleClientClick}
        >
          Login as Client
        </button>
        <button
          className={`w-1/2 py-2 text-sm font-medium transition-all duration-300 ${
            !isClient
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={handleProfessionalClick}
        >
          Login as Professional
        </button>
      </div>
    </div>
  );
};

export default LoginToggle;
