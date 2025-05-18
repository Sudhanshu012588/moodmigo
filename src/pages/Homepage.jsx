import React, { use, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServicesSection from '../components/Services'
import PremiumPage from '../components/Premium.'
import AboutPage from '../components/About'
import Footer from '../components/Footer'
import { useStore } from '../store/store'
function Homepage() {
  const User = useStore((state) => state.User);
  const type = useStore((state)=>state.type);
  const setType = useStore((state)=>state.setType);
  useEffect(() => {
    setType(localStorage.getItem("type"))
    if(!User.isLoggedIn){
      const token = localStorage.getItem('token');
      if(token){
        useStore.setState({User: {isLoggedIn: true}});

      }
    }
      
  },[])
  return (

    <>
      <div className="fixed top-0 left-0 w-full z-50">
  <Navbar />
</div>

        <Hero/>
        <div id='services'>

        <ServicesSection/>
        </div>
        {/* <PremiumPage/> */}

        <div id='about'>
        <AboutPage/></div>
        <Footer/>
    </>
  )
}

export default Homepage