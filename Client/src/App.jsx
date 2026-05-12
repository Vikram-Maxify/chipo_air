import { useEffect } from "react";
import "./App.css";

import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home";
import Flights from "./page/Flights";
import Profile from "./page/Profile";
import AboutPage from "./page/AboutPage";
import PrivacyPage from "./page/PrivacyPage";
import Packages from "./component/Packages";
import PackageDetail from "./page/PackageDetail";
import Header from "./component/Header";
import CTASection from "./component/CTASection";
import Footer from "./component/Footer";
import FlightBooking from "./page/FlightBooking";
import PrivateRoute from "./component/PrivateRoute";

import { getProfile } from "./reducer/slice/authslice";

function App() {
  const dispatch = useDispatch();

  // Get logged-in user on refresh
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <>
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/package/:slug" element={<PackageDetail />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/flights/booking/:id"
            element={<FlightBooking />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Routes>

      <CTASection />
      <Footer />
    </>
  );
}

export default App;