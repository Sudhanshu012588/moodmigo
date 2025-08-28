import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesSection from '../components/Services';
import AboutPage from '../components/About';
import Footer from '../components/Footer';
import { useStore } from '../store/store';
import { Client,Account } from 'appwrite';

function Homepage() {
  const User = useStore((state) => state.User);
  const type = useStore((state) => state.type);
  const setType = useStore((state) => state.setType);
  const setUser = useStore((state) => state.setUser);

  // useEffect(() => {
  //   // restore user type if stored
  //   const savedType = localStorage.getItem("type");
  //   if (savedType) {
  //     setType(savedType);
  //   }

  //   // try to restore Appwrite session
  //   const checkSession = async () => {
  //     try {
  //       const client = new Client()
  //       .setEndpoint("https://fra.cloud.appwrite.io/v1").setProject(import.meta.env.VITE_PROJECT_ID)
  //       const account = new Account(client)
  //       const user = await account.get(); // if session cookie is valid, this works
  //       setUser({ isLoggedIn: true, details: user });
  //       console.log("User restored from Appwrite session:", user);
  //       setUser({
  //         id:user.$id,
  //         name:user.name,
  //         email: user.email,
  //         isLoggedIn: true,
  //         profilepicture:"",
  //         coverimage:""
  //       })
  //     } catch (err) {
  //       console.log("No active session:", err.message);
  //       // setUser({ isLoggedIn: false, details: null });
  //     }
  //   };

  //   checkSession();
  // }, [setType, setUser]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <Hero />
      <div id="services">
        <ServicesSection />
      </div>

      <div id="about">
        <AboutPage />
      </div>
      
      <Footer />
    </>
  );
}

export default Homepage;
