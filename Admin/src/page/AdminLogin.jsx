import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../reducer/slice/adminSlice"
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, admin } = useSelector((state) => state.admin);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(adminLogin(form));
    };

    // redirect after login
    useEffect(() => {
        if (admin) {
            navigate("/dashboard");
        }
    }, [admin, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Admin Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div>

        </div>
    );
};

export default AdminLogin;