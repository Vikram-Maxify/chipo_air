import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, setPassword } from "../reducer/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, otpSent, verified, success } = useSelector(
        (state) => state.auth
    );

    const [form, setForm] = useState({
        email: "",
        otp: "",
        firstname: "",
        lastname: "",
        password: "",
    });

    const [googleError, setGoogleError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 GOOGLE LOGIN CLICK
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5004/api/auth/google";
    };

    // 🔥 HANDLE TOKEN + ERROR FROM GOOGLE
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (token) {
            localStorage.setItem("token", token);

            // clean URL
            window.history.replaceState({}, document.title, "/");

            navigate("/dashboard"); // change if needed
        }

        if (error) {
            setGoogleError("Google login failed. Try again.");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Create Account
                </h2>

                {/* 🔥 GOOGLE BUTTON */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 p-3 rounded-lg mb-4 hover:bg-gray-50 transition"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>

                {/* DIVIDER */}
                <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 h-[1px] bg-gray-300"></div>
                    <p className="text-xs text-gray-400">OR</p>
                    <div className="flex-1 h-[1px] bg-gray-300"></div>
                </div>

                {/* 🔹 STEP 1: EMAIL */}
                {!otpSent && (
                    <>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />

                        <button
                            onClick={() => dispatch(sendOtp({ email: form.email }))}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* 🔹 STEP 2: OTP VERIFY */}
                {otpSent && !verified && (
                    <>
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            className="w-full border p-3 rounded-lg mb-3"
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            className="w-full border p-3 rounded-lg mb-3"
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            className="w-full border p-3 rounded-lg mb-4"
                            onChange={handleChange}
                        />

                        <button
                            onClick={() =>
                                dispatch(
                                    verifyOtp({
                                        email: form.email,
                                        otp: form.otp,
                                        firstname: form.firstname,
                                        lastname: form.lastname,
                                    })
                                )
                            }
                            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}

                {/* 🔹 STEP 3: SET PASSWORD */}
                {verified && !success && (
                    <>
                        <input
                            type="password"
                            name="password"
                            placeholder="Set Password"
                            className="w-full border p-3 rounded-lg mb-4"
                            onChange={handleChange}
                        />

                        <button
                            onClick={() =>
                                dispatch(
                                    setPassword({
                                        email: form.email,
                                        password: form.password,
                                    })
                                )
                            }
                            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
                        >
                            {loading ? "Saving..." : "Set Password"}
                        </button>
                    </>
                )}

                {/* SUCCESS */}
                {success && (
                    <p className="text-green-600 text-center mt-4">
                        🎉 Account created successfully!
                    </p>
                )}

                {/* ERROR */}
                {error && (
                    <p className="text-red-500 text-center mt-2">{error}</p>
                )}

                {/* GOOGLE ERROR */}
                {googleError && (
                    <p className="text-red-500 text-center mt-2">
                        {googleError}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;