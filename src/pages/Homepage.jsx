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
      <div className="fixed top-0 left-0 w-full z-50">
  <Navbar />
</div>

        <Hero/>
        <div id='services'>

        <ServicesSection/>
        </div>
        <PremiumPage/>

        <div id='about'>
        <AboutPage/></div>
        <Footer/>
    </>
  )
}

export default Homepage