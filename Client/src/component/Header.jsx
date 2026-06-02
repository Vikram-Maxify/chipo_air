import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../reducer/slice/authslice";
import {
    Plane,
    Menu,
    X,
    User,
    LogOut,
    ChevronDown,
    Settings,
    Heart,
    Calendar,
    Gift,
    Bell,
    Search,
    MapPin,
    Phone
} from "lucide-react";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setProfileDropdown(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setMobileMenuOpen(false);
        setProfileDropdown(false);
    };

    const navLinks = [
        { to: "/flights", label: "Flights", icon: Plane },
        { to: "/hotels", label: "Hotels", icon: MapPin },
        { to: "/packages", label: "Packages", icon: Gift },
        { to: "/all_offers", label: "Deals", icon: Calendar },
        // { to: "/my-trips", label: "My Trips", icon: MapPin },
    ];

    return (
      <header
        className={`sticky top-0 z-[999999] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="https://i.ibb.co/0y65NQpQ/logo-1.png"
                  alt="Flight Booker Logo"
                  className="h-10 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                />

                {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div> */}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
             
              {/* Notifications */}
              {isAuthenticated && (
                <button className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user?.firstname?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user.firstname || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${profileDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/my-trips"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          My Bookings
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-2 px-4">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-0 py-2.5 text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : ( 
                <Link
                  to="/login"
                  className="group relative overflow-hidden px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-sm font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.45)] transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Text */}
                  <span className="relative z-10">Sign In / Sign Up</span>

                  {/* Arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setProfileDropdown(false);
              }}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span
                  className={`absolute block h-0.5 w-5 bg-gray-600 transform transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 top-2.5" : "top-0"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-5 bg-gray-600 top-2 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-5 bg-gray-600 transform transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 top-2.5" : "top-4"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-100 py-4 space-y-1">
              {/* Mobile Search */}
              <div className="px-2 pb-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search flights..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Mobile Nav Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              <div className="px-2 pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    <Link
                      to="/my-trips"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                    >
                      <Calendar className="w-5 h-5" />
                      My Bookings
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                    >
                      <Heart className="w-5 h-5" />
                      Wishlist
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group relative overflow-hidden w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-sm font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2"
                  >
                    {/* Glow */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-300" />

                    {/* Text */}
                    <span className="relative z-10">Sign In / Sign Up</span>

                    {/* Arrow */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="relative z-10 w-4 h-4 transition-transform duration-300 group-active:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add to global CSS */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </header>
    );
};

export default Header;