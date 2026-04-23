import React, { useState } from "react";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = () => {
        console.log("Login data:", form);
        // dispatch(loginUser(form)) 👈 future me
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Login
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="w-full border p-3 rounded-lg mb-3"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    className="w-full border p-3 rounded-lg mb-4"
                    onChange={handleChange}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg"
                >
                    Login
                </button>

                <p className="text-sm text-center mt-4 text-gray-500">
                    Don't have an account? Register
                </p>
            </div>
        </div>
    );
};

export default Login;