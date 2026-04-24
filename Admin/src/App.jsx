import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import Dashboard from './page/Dashboard'
import Settings from './page/Settings'
import Users from './page/Users'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
