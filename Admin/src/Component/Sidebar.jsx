import React from "react";
import {
    Home,
    Plane,
    Ticket,
    Info,
    Shield,
    Users,
    Settings,

    UserPen
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navLinks = [
    { label: "Dashboard", icon: <Home />, path: "/dashboard" },

    { label: "Manage Flights", icon: <Plane />, path: "/flights" },

    { label: "Manage Bookings", icon: <Ticket />, path: "/bookings" },

    { label: "Manage About", icon: <Info />, path: "/manage_about" },

    { label: "Manage Privacy", icon: <Shield />, path: "/manage_privacy" },

    { label: "Users", icon: <Users />, path: "/users" },

    { label: "Settings", icon: <Settings />, path: "/settings" },
    { label: "Profile", icon: <UserPen />, path: "/profile" },
];

const Sidebar = ({ isOpen }) => {
    return (
        <div
            className={`h-screen bg-white shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-16"
                }`}
        >
            <div className="p-4 text-xl font-bold">
                {isOpen ? "Admin" : "A"}
            </div>

            <nav className="mt-6 space-y-2">
                {navLinks.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 p-3 cursor-pointer ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                            }`
                        }
                    >
                        {item.icon}
                        {isOpen && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;