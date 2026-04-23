import React from 'react'
import  Header  from '../component/Header'
import Hero from '../component/Hero'
import Packages from '../component/Packages'
import PopularDestinations from '../component/PopularDestinations'

const Home = () => {
  return (
    <>
    <Header />
    <Hero />
    <Packages />
    <PopularDestinations />
    </>
  )
}

export default Home