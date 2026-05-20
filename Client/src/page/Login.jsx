import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    Globe,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Plane,
    ArrowRight,
    AlertCircle,
    CheckCircle
} from "lucide-react";

import { loginUser } from "../reducer/slice/authslice";
import API from "../reducer/axios";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } =
        useSelector((state) => state.auth || {});

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [focusedField, setFocusedField] =
        useState(null);

    const [errors, setErrors] = useState({});

    const [rememberMe, setRememberMe] =
        useState(false);

    // =========================
    // GOOGLE LOGIN
    // =========================
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5004/api/auth/google";
    };

    // =========================
    // HANDLE INPUT CHANGE
    // =========================
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    // =========================
    // VALIDATE FORM
    // =========================
    const validateForm = () => {

        const newErrors = {};

        if (!form.email) {

            newErrors.email =
                "Email is required";

        } else if (
            !/\S+@\S+\.\S+/.test(form.email)
        ) {

            newErrors.email =
                "Please enter valid email";
        }

        if (!form.password) {

            newErrors.password =
                "Password is required";

        } else if (
            form.password.length < 6
        ) {

            newErrors.password =
                "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // =========================
    // EMAIL LOGIN
    // =========================
    const handleLogin = async () => {

        if (!validateForm()) return;

        try {

            const result =
                await dispatch(
                    loginUser(form)
                ).unwrap();

            console.log(result);

            navigate("/");

        } catch (err) {

            console.log(
                "Login failed:",
                err
            );
        }
    };

    // =========================
    // ENTER PRESS LOGIN
    // =========================
    const handleKeyPress = (e) => {

        if (e.key === "Enter") {
            handleLogin();
        }
    };

    // =========================
    // DEMO LOGIN
    // =========================
    const fillDemoCredentials = () => {

        setForm({
            email:
                "renawi5031@lohinja.com",

            password: "123456",
        });

        setErrors({});
    };

    // =========================
    // SCROLL TOP
    // =========================
    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-purple-50">

            {/* LEFT SIDE */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden items-center justify-center">

                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>

                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative text-center text-white p-12 max-w-lg">

                    <div className="flex justify-center mb-8">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                            <Plane className="w-16 h-16 text-white transform -rotate-45" />
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Welcome Back!
                    </h2>

                    <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                        Ready for your next adventure?
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">

                <div className="w-full max-w-md">

                    {/* MOBILE LOGO */}
                    <div className="lg:hidden text-center mb-8">

                        <div className="inline-flex items-center gap-3">

                            <div className="bg-blue-600 p-3 rounded-xl">
                                <Plane className="w-8 h-8 text-white transform -rotate-45" />
                            </div>

                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                FlightBooker
                            </span>

                        </div>
                    </div>

                    {/* FORM BOX */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">

                        {/* HEADER */}
                        <div className="text-center mb-8">

                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Sign In
                            </h1>

                            <p className="text-gray-500">
                                Welcome back!
                            </p>

                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">

                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />

                                <div>

                                    <p className="text-sm font-medium text-red-800">
                                        Login Failed
                                    </p>

                                    <p className="text-sm text-red-600 mt-1">
                                        {error}
                                    </p>

                                </div>
                            </div>
                        )}

                        {/* GOOGLE LOGIN */}
                        <div className="grid grid-cols-2 gap-3 mb-6">

                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
                            >
                                <Globe className="w-5 h-5 text-red-500" />

                                Google
                            </button>

                            <button
                                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
                            >
                                <Globe className="w-5 h-5" />

                                GitHub
                            </button>

                        </div>

                        {/* DIVIDER */}
                        <div className="relative mb-6">

                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>

                            <div className="relative flex justify-center text-sm">

                                <span className="px-4 bg-white text-gray-500">
                                    or continue with email
                                </span>

                            </div>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={(e) =>
                                e.preventDefault()
                            }
                            className="space-y-5"
                        >

                            {/* EMAIL */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === "email"
                                        ? "text-blue-600"
                                        : "text-gray-400"
                                        }`} />

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onFocus={() =>
                                            setFocusedField(
                                                "email"
                                            )
                                        }
                                        onBlur={() =>
                                            setFocusedField(
                                                null
                                            )
                                        }
                                        onKeyPress={
                                            handleKeyPress
                                        }
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                                    />

                                    {form.email &&
                                        !errors.email && (
                                            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}

                                </div>

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* PASSWORD */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        onKeyPress={
                                            handleKeyPress
                                        }
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>

                                </div>

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}

                            </div>

                            {/* REMEMBER */}
                            <div className="flex items-center justify-between">

                                <label className="flex items-center gap-2 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(
                                                e.target
                                                    .checked
                                            )
                                        }
                                    />

                                    <span className="text-sm text-gray-600">
                                        Remember me
                                    </span>

                                </label>

                                <button
                                    type="button"
                                    className="text-sm text-blue-600"
                                >
                                    Forgot password?
                                </button>

                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >

                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}

                            </button>

                        </form>

                        {/* DEMO */}
                        <button
                            onClick={
                                fillDemoCredentials
                            }
                            className="w-full mt-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Use Demo Credentials
                        </button>

                        {/* REGISTER */}
                        <p className="text-center mt-8 text-sm text-gray-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-blue-600"
                            >
                                Create free account
                            </Link>

                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;