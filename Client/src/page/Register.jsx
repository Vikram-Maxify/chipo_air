import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, setPassword } from "../reducer/slice/authSlice";

const Register = () => {
    const dispatch = useDispatch();
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Create Account
                </h2>

                {/* 🔹 STEP 1: EMAIL */}
                {!otpSent && (
                    <>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className="w-full border p-3 rounded-lg mb-4"
                            onChange={handleChange}
                        />

                        <button
                            onClick={() => dispatch(sendOtp({ email: form.email }))}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg"
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
                            className="w-full bg-green-600 text-white p-3 rounded-lg"
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
                            className="w-full bg-purple-600 text-white p-3 rounded-lg"
                        >
                            {loading ? "Saving..." : "Set Password"}
                        </button>
                    </>
                )}

                {/* 🔹 SUCCESS */}
                {success && (
                    <p className="text-green-600 text-center mt-4">
                        🎉 Account created successfully!
                    </p>
                )}

                {/* 🔹 ERROR */}
                {error && (
                    <p className="text-red-500 text-center mt-2">{error}</p>
                )}
            </div>
        </div>
    );
};

export default Register;