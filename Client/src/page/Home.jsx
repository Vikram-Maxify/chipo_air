import React from 'react'
import  Header  from '../component/Header'
import Hero from '../component/Hero'
import Packages from '../component/Packages'
import PopularDestinations from '../component/PopularDestinations'
import WhyChooseUs from '../component/WhyChooseUs'
import CTASection from '../component/CTASection'
import Footer from '../component/Footer'
import StatsSection from '../StatsSection'

const Home = () => {
  return (
    <>
    <Header />
    <Hero />
    <Packages />
    <PopularDestinations />
    <WhyChooseUs />
    <StatsSection />
    <CTASection />
    <Footer />
    </>
  )
}

export default Home