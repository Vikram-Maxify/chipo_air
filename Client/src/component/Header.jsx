import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Menu, X } from "lucide-react";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                        <button className="px-4 py-2 rounded-lg hover:bg-gray-100">
                            Sign In
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            Sign Up
                        </button>
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
                            <button className="flex-1 px-4 py-2 rounded-lg hover:bg-gray-100">
                                Sign In
                            </button>
                            <button className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </header>
    );
};

export default Header;