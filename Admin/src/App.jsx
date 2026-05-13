import { useEffect } from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { fetchAdminProfile } from "./reducer/slice/adminSlice";

// ====================== LAYOUT ======================

import AdminLayout from "./layout/AdminLayout";

// ====================== PAGES ======================

import Dashboard from "./page/Dashboard";
import Settings from "./page/Settings";
import Users from "./page/Users";
import Package from "./page/Package";
import AdminLogin from "./page/AdminLogin";
import PrivacyPageEditor from "./page/PrivacyPageEditor";
import AboutPageEditor from "./page/AboutPageEditor";

// ====================== PRIVATE ROUTE ======================

import AdminPrivateRoute from "./Component/AdminPrivateRoute";

function App() {
  const dispatch = useDispatch();

  // ====================== FETCH ADMIN PROFILE ======================

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  return (
    <Routes>

      {/* ====================== LOGIN ====================== */}

      <Route path="/login" element={<AdminLogin />} />

      {/* ====================== PRIVATE ROUTES ====================== */}

      <Route element={<AdminPrivateRoute />}>
        
        <Route path="/" element={<AdminLayout />}>

          {/* DEFAULT REDIRECT */}
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* USERS */}
          <Route
            path="users"
            element={<Users />}
          />

          {/* SETTINGS */}
          <Route
            path="settings"
            element={<Settings />}
          />

          {/* PACKAGE */}
          <Route
            path="package"
            element={<Package />}
          />

          {/* ABOUT PAGE */}
          <Route
            path="manage_about"
            element={<AboutPageEditor />}
          />

          {/* PRIVACY PAGE */}
          <Route
            path="manage_privacy"
            element={<PrivacyPageEditor />}
          />

        </Route>
      </Route>

      {/* ====================== 404 REDIRECT ====================== */}

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}

export default App;