import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import Dashboard from './page/Dashboard'
import Settings from './page/Settings'
import Users from './page/Users'
import AdminPrivateRoute from './Component/AdminPrivateRoute'
import AdminLogin from './page/AdminLogin'
import { useDispatch } from 'react-redux'
import { fetchAdminProfile } from './reducer/slice/adminSlice'

function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProfile()); // 🔥 AUTO LOGIN FIX
  }, [dispatch]);

  return (
    <>
    <Routes>
      <Route path="/login" element={<AdminLogin />} />


      <Route element={<AdminPrivateRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
