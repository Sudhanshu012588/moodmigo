import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServicesSection from '../components/Services'
import PremiumPage from '../components/Premium.'
import AboutPage from '../components/About'
import Footer from '../components/Footer'
function Homepage() {
  return (

    <>
        <Navbar/>
        <Hero/>
        <ServicesSection/>
        <PremiumPage/>
        <AboutPage/>
        <Footer/>
    </>
  )
}

export default Homepage