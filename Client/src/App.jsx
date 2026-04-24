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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/flights" element={<Flights />} />
    <Route path="/profile" element={<Profile />} />

  </Routes>
    </>
  )
}

export default App
