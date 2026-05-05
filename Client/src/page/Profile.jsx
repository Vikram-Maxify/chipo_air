import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../reducer/slice/authslice";
import { User, Mail, LogOut, ArrowLeft } from "lucide-react";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                    <h2 className="text-2xl font-semibold mb-4">Not Logged In</h2>
                    <p className="text-gray-600 mb-6">
                        Please log in to view your profile.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header with Back Button */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
                        <div className="flex items-center gap-6">
                            <div className="bg-white p-4 rounded-full">
                                <User size={48} className="text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {user.firstname && user.lastname
                                        ? `${user.firstname} ${user.lastname}`
                                        : "User Profile"}
                                </h1>
                                <p className="text-blue-100">
                                    Welcome back to FlightBooker
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="px-8 py-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                Personal Information
                            </h2>

                            <div className="space-y-6">
                                {/* First Name */}
                                {user.firstname && (
                                    <div className="border-b pb-4">
                                        <p className="text-gray-600 text-sm font-medium mb-2">
                                            FIRST NAME
                                        </p>
                                        <p className="text-lg text-gray-800">
                                            {user.firstname}
                                        </p>
                                    </div>
                                )}

                                {/* Last Name */}
                                {user.lastname && (
                                    <div className="border-b pb-4">
                                        <p className="text-gray-600 text-sm font-medium mb-2">
                                            LAST NAME
                                        </p>
                                        <p className="text-lg text-gray-800">
                                            {user.lastname}
                                        </p>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="flex items-center gap-4 border-b pb-4">
                                    <Mail size={20} className="text-blue-600" />
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium mb-1">
                                            EMAIL
                                        </p>
                                        <p className="text-lg text-gray-800">
                                            {user.email || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="mt-8 pt-6 border-t">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 font-semibold transition duration-200"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">
                        Tips for your account:
                    </h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                        <li>✓ Update your profile information regularly</li>
                        <li>✓ Keep your email address current</li>
                        <li>✓ Ensure your password is secure</li>
                        <li>✓ Log out after each session</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;
