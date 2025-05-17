import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useStore} from '../store/store';
const Hero = () => {
  const { User } = useStore((state) => state);
  const type = localStorage.getItem('type')
  const navigator = useNavigate();
  const Navigate = () =>{
    if(type === "Client"){
      navigator('/dashboard')
    }
    else if(type === "Professional"){
      navigator('/mentorsdashboard')
    }
  }
  return (
    <section className="relative bg-[#f5f6fc] overflow-hidden min-h-screen flex items-center justify-center px-4">
      {/* Background Wave SVG */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#e6e9f6"
            d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,229.3C840,213,960,139,1080,122.7C1200,107,1320,149,1380,170.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          <span className="text-purple-500">Your Mental Health Journey</span><br />
          <span className="text-gray-700">Starts Here</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          MoodMigo connects you with professional psychiatrists and a supportive community
          to guide you through your mental wellness journey.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            onClick={() =>{User.isLoggedin?Navigate() :navigator('/signup')}}
          >
            Get Started
          </button>
          <button className="border border-purple-500 text-purple-600 font-semibold py-2 px-6 rounded-lg hover:bg-purple-50 transition duration-300"
          onClick={() =>{User.isLoggedIn?Navigate() :navigator('/login')}}
>
            I Already Have an Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
