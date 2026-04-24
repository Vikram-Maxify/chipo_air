import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducer/slice/authslice";
import { Plane, Menu, X, User, LogOut } from "lucide-react";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">

                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Plane className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-semibold text-xl hidden sm:inline">
                            FlightBooker
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/flights" className="hover:text-blue-600">Flights</Link>
                        <Link to="/packages" className="hover:text-blue-600">Packages</Link>
                        <Link to="/">Deals</Link>
                        <Link to="/">My Trips</Link>
                    </nav>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                                >
                                    <User size={18} />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg hover:bg-gray-100"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t py-4 space-y-4">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block">
                            Flights
                        </Link>
                        <Link to="/packages" onClick={() => setMobileMenuOpen(false)} className="block">
                            Packages
                        </Link>
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block">
                            Deals
                        </Link>
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block">
                            My Trips
                        </Link>

                        <div className="flex gap-3 pt-4 border-t">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                                    >
                                        <User size={18} />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex-1 px-4 py-2 rounded-lg hover:bg-gray-100 text-center"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </header>
    );
};

export default Header;