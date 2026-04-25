import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './page/Login'
import Register from './page/Register'
import Home from './page/Home'
import Flights from './page/Flights'
import Profile from './page/Profile'
import AboutPage from './page/AboutPage'
import PrivacyPage from './page/PrivacyPage'
import Packages from './component/Packages'
import PackageDetail from './page/PackageDetail'
import Header from './component/Header'
import WhyChooseUs from './component/WhyChooseUs'
import StatsSection from './StatsSection'
import CTASection from './component/CTASection'
import Footer from './component/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/privacy' element={<PrivacyPage />} />
        <Route path='/packages' element={<Packages />} />
        <Route path="/package/:slug" element={<PackageDetail />} />

      </Routes>
          <CTASection />
          <Footer />
      
    </>
  )
}

export default App
