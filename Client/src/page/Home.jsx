import React, { useEffect } from 'react'
import Header from '../component/Header'
import Hero from '../component/Hero'
import Packages from '../component/Packages'
import PopularDestinations from '../component/PopularDestinations'
import WhyChooseUs from '../component/WhyChooseUs'
import Footer from '../component/Footer'
import StatsSection from '../StatsSection'
import Offers from '../component/Offers'
import Banners from '../component/Banners'

const Home = () => {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
    <>
      <Hero />
      <Banners />
      <Packages />
      <Offers />
      <PopularDestinations />
      <WhyChooseUs />
      <StatsSection />

    </>
  )
}

export default Home