import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, setPassword } from "../reducer/slice/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Plane,
    ArrowRight,
    ArrowLeft,
    Globe,
    User,
    CheckCircle,
    AlertCircle,
    Shield,
    Key,
    Sparkles
} from "lucide-react";

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
        confirmPassword: "",
    });

    const [googleError, setGoogleError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear field error on change
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
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
            window.history.replaceState({}, document.title, "/");
            navigate("/dashboard");
        }

        if (error) {
            setGoogleError("Google login failed. Please try again.");
        }
    }, [navigate]);

    // Update step based on state
    useEffect(() => {
        if (success) {
            setCurrentStep(4);
        } else if (verified) {
            setCurrentStep(3);
        } else if (otpSent) {
            setCurrentStep(2);
        } else {
            setCurrentStep(1);
        }
    }, [otpSent, verified, success]);

    const validateEmail = () => {
        if (!form.email) {
            setErrors({ email: "Email is required" });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setErrors({ email: "Please enter a valid email" });
            return false;
        }
        return true;
    };

    const validateOtpStep = () => {
        const newErrors = {};
        if (!form.otp) newErrors.otp = "OTP is required";
        if (!form.firstname) newErrors.firstname = "First name is required";
        if (!form.lastname) newErrors.lastname = "Last name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordStep = () => {
        const newErrors = {};
        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = () => {
        if (validateEmail()) {
            dispatch(sendOtp({ email: form.email }));
        }
    };

    const handleVerifyOtp = () => {
        if (validateOtpStep()) {
            dispatch(
                verifyOtp({
                    email: form.email,
                    otp: form.otp,
                    firstname: form.firstname,
                    lastname: form.lastname,
                })
            );
        }
    };

    const handleSetPassword = () => {
        if (validatePasswordStep()) {
            dispatch(
                setPassword({
                    email: form.email,
                    password: form.password,
                })
            );
        }
    };

    const steps = [
        { number: 1, label: "Email", icon: Mail },
        { number: 2, label: "Verify", icon: Shield },
        { number: 3, label: "Password", icon: Key },
        { number: 4, label: "Done", icon: CheckCircle },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-purple-50">

            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden items-center justify-center">
                {/* Animated elements */}
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
                        Start Your Journey
                    </h2>

                    <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                        Create your account and unlock exclusive flight deals,
                        easy booking, and personalized travel recommendations.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold">3M+</div>
                            <div className="text-sm text-blue-200">Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">24h</div>
                            <div className="text-sm text-blue-200">Support</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">100%</div>
                            <div className="text-sm text-blue-200">Secure</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
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

                    {/* Form Container */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
                                <Sparkles className="w-4 h-4" />
                                Free account setup
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Account
                            </h1>
                            <p className="text-gray-500">
                                Join us and start booking your flights
                            </p>
                        </div>

                        {/* Step Progress */}
                        <div className="flex items-center justify-between mb-8">
                            {steps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isActive = currentStep === step.number;
                                const isCompleted = currentStep > step.number;

                                return (
                                    <div key={step.number} className="flex items-center">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : isActive
                                                        ? "bg-blue-600 text-white shadow-lg"
                                                        : "bg-gray-100 text-gray-400"
                                                }`}>
                                                {isCompleted ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <StepIcon className="w-5 h-5" />
                                                )}
                                            </div>
                                            <span className={`text-xs mt-2 font-medium ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${isCompleted ? "bg-green-500" : "bg-gray-200"
                                                }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Google Sign Up */}
                        {!otpSent && !success && (
                            <>
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 p-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm font-medium"
                                >
                                    <Globe className="w-5 h-5 text-red-500" />
                                    Continue with Google
                                </button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">or</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Error Alert */}
                        {(error || googleError) && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">Error</p>
                                    <p className="text-sm text-red-600 mt-1">{error || googleError}</p>
                                </div>
                            </div>
                        )}

                        {/* Success Alert */}
                        {success && (
                            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-lg font-semibold text-green-800 mb-1">
                                    Account Created Successfully!
                                </p>
                                <p className="text-sm text-green-600 mb-4">
                                    Welcome aboard! You can now login to your account.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-medium"
                                >
                                    Go to Login
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {/* STEP 1: Email */}
                        {!otpSent && !success && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "email" ? "text-blue-600" : "text-gray-400"
                                            }`} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("email")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter your email"
                                            className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 text-sm ${errors.email
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                }`}
                                        />
                                        {form.email && !errors.email && (
                                            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            Send OTP
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* STEP 2: OTP & Name */}
                        {otpSent && !verified && !success && (
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
                                    <p className="text-sm text-blue-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        OTP sent to {form.email}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <div className="relative">
                                        <Shield className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "otp" ? "text-blue-600" : "text-gray-400"
                                            }`} />
                                        <input
                                            type="text"
                                            name="otp"
                                            value={form.otp}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("otp")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 text-sm tracking-widest ${errors.otp
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                }`}
                                        />
                                    </div>
                                    {errors.otp && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.otp}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="firstname"
                                                value={form.firstname}
                                                onChange={handleChange}
                                                placeholder="John"
                                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 text-sm ${errors.firstname
                                                        ? "border-red-300 focus:border-red-500"
                                                        : "border-gray-200 focus:border-blue-500"
                                                    }`}
                                            />
                                        </div>
                                        {errors.firstname && (
                                            <p className="mt-1 text-xs text-red-600">{errors.firstname}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="lastname"
                                                value={form.lastname}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 text-sm ${errors.lastname
                                                        ? "border-red-300 focus:border-red-500"
                                                        : "border-gray-200 focus:border-blue-500"
                                                    }`}
                                            />
                                        </div>
                                        {errors.lastname && (
                                            <p className="mt-1 text-xs text-red-600">{errors.lastname}</p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify & Continue
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* STEP 3: Set Password */}
                        {verified && !success && (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2">
                                    <p className="text-sm text-green-700 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Email verified successfully!
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Set Password
                                    </label>
                                    <div className="relative">
                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "password" ? "text-purple-600" : "text-gray-400"
                                            }`} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("password")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Create a strong password"
                                            className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 text-sm ${errors.password
                                                    ? "border-red-300 focus:border-red-500"
                                                    : "border-gray-200 focus:border-purple-500"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 text-sm ${errors.confirmPassword
                                                    ? "border-red-300 focus:border-red-500"
                                                    : "border-gray-200 focus:border-purple-500"
                                                }`}
                                        />
                                        {form.password && form.confirmPassword && form.password === form.confirmPassword && (
                                            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleSetPassword}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Back to Login Link */}
                        {!success && (
                            <p className="text-center mt-8 text-sm text-gray-500">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        )}
                    </div>

                    {/* Footer Text */}
                    <p className="text-center mt-6 text-xs text-gray-400">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

export default Register;