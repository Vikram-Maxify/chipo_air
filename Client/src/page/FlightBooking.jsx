import React, { useState } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Plane,
    User,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    Loader2,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

import { createFlightBookingThunk } from "../reducer/slice/flightBookingSlice";

import {
    createPayment,
    verifyPayment,
    paymentFailed,
} from "../reducer/slice/paymentSlice";

const FlightBooking = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    const { id } = useParams();



    // AUTH
    const { user } = useSelector(
        (state) => state.auth
    );



    // FLIGHTS
    const { flights } = useSelector(
        (state) => state.flights
    );



    // BOOKING STORE
    const {
        loading: bookingLoading,
        success,
        error,
        bookingDetails,
    } = useSelector(
        (state) => state.flightBooking
    );



    // PAYMENT STORE
    const {
        loading: paymentLoading,
    } = useSelector(
        (state) => state.payment
    );



    // CURRENT FLIGHT
    const flight =
        location.state?.flight ||
        flights.find(
            (f) =>
                f.offerId === id
        );



    // FORM STATE
    const [formData, setFormData] =
        useState({
            title: "mr",

            firstName: "",

            lastName: "",

            email:
                user?.email || "",

            phone: "",

            gender: "m",

            born_on: "",
        });



    // NO FLIGHT
    if (!flight) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-3">
                        No Flight
                        Selected
                    </h1>

                    <button
                        onClick={() =>
                            navigate(
                                "/flights"
                            )
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }



    // INPUT CHANGE
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,

            [e.target.name]:
                e.target.value,
        }));
    };



    // HANDLE BOOKING
    const handleBooking = async () => {
        try {
            // VALIDATION
            if (
                !formData.firstName?.trim() ||
                !formData.lastName?.trim() ||
                !formData.email?.trim() ||
                !formData.phone?.trim() ||
                !formData.born_on
            ) {
                alert(
                    "Please fill all fields"
                );

                return;
            }



            // VALID PASSENGER ID
            if (
                !flight?.passengerId ||
                !flight?.passengerId.startsWith(
                    "pas_"
                )
            ) {
                alert(
                    "Invalid Duffel passenger ID"
                );

                return;
            }



            // PRICE
            const priceParts =
                flight.price?.split(" ") || [];

            // ORIGINAL PRICE
            const originalAmount =
                parseFloat(priceParts?.[0]) || 0;

            const originalCurrency =
                priceParts?.[1] || "USD";

            // USD -> INR CONVERSION
            const usdToInrRate = 83;

            // FINAL INR AMOUNT
            const amountInr = Math.round(
                originalAmount * usdToInrRate
            );

            // RAZORPAY AMOUNT (PAISE)
            const razorpayAmount =
                amountInr * 100;



            // PAYMENT PAYLOAD
            const paymentPayload = {
                title:
                    formData.title,

                firstName:
                    formData.firstName,

                lastName:
                    formData.lastName,

                email:
                    formData.email,

                phone:
                    formData.phone,

                dob:
                    formData.born_on,

                gender:
                    formData.gender ===
                        "m"
                        ? "Male"
                        : "Female",

                airline:
                    flight.airline,

                flightNumber:
                    flight.flightNumber,

                from:
                    flight.route.from
                        .code,

                to: flight.route.to.code,

                amount: amountInr,
                currency: "INR",
            };



            // STEP 1 CREATE PAYMENT
            const paymentResult =
                await dispatch(
                    createPayment(
                        paymentPayload
                    )
                );



            // PAYMENT FAILED
            if (
                !createPayment.fulfilled.match(
                    paymentResult
                )
            ) {
                alert(
                    paymentResult.payload ||
                    "Payment creation failed"
                );

                return;
            }



            const order =
                paymentResult.payload
                    .order;



            // STEP 2 OPEN RAZORPAY
            const options = {
                key:
                    paymentResult.payload.key,

                amount: razorpayAmount,
                currency: "INR",

                name:
                    "Flight Booking",

                description:
                    "Flight Ticket Payment",

                order_id:
                    order.id,



                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,

                    email: formData.email,

                    contact: formData.phone.startsWith("+91")
                        ? formData.phone
                        : `+91${formData.phone}`,
                },



                handler:
                    async function (
                        response
                    ) {
                        // your verify logic
                    },



                modal: {
                    ondismiss:
                        async function () {
                            await dispatch(
                                paymentFailed({
                                    razorpayOrderId:
                                        order.id,

                                    errorMessage:
                                        "User closed payment popup",
                                })
                            );
                        },
                },



                theme: {
                    color: "#2563eb",
                },
            };



            if (!window.Razorpay) {
                alert(
                    "Razorpay SDK failed to load"
                );

                return;
            }

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.open();
        } catch (error) {
            console.log(error);

            alert(
                error.message ||
                "Something went wrong"
            );
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4 text-white">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                    {/* HEADER */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-blue-500/20 p-3 rounded-2xl">
                            <Plane className="w-7 h-7 text-blue-300" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">
                                Passenger Details
                            </h1>

                            <p className="text-slate-300 text-sm mt-1">
                                Complete your booking information
                            </p>
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="grid md:grid-cols-2 gap-5">
                        {/* TITLE */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Title
                            </label>

                            <select
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                            >
                                <option value="mr">
                                    Mr
                                </option>

                                <option value="mrs">
                                    Mrs
                                </option>

                                <option value="ms">
                                    Ms
                                </option>
                            </select>
                        </div>

                        {/* FIRST NAME */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                First Name
                            </label>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                <input
                                    type="text"
                                    name="firstName"
                                    value={
                                        formData.firstName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter first name"
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                                />
                            </div>
                        </div>

                        {/* LAST NAME */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Last Name
                            </label>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                <input
                                    type="text"
                                    name="lastName"
                                    value={
                                        formData.lastName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter last name"
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter email"
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                                />
                            </div>
                        </div>

                        {/* PHONE */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Phone
                            </label>

                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter phone number"
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                                />
                            </div>
                        </div>

                        {/* DOB */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Date of Birth
                            </label>

                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                <input
                                    type="date"
                                    name="born_on"
                                    value={
                                        formData.born_on
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    max={
                                        new Date()
                                            .toISOString()
                                            .split(
                                                "T"
                                            )[0]
                                    }
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                                />
                            </div>
                        </div>

                        {/* GENDER */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={
                                    formData.gender
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                            >
                                <option value="m">
                                    Male
                                </option>

                                <option value="f">
                                    Female
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mt-5 bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl">
                            {error}
                        </div>
                    )}

                    {/* BUTTON */}
                    <button
                        onClick={
                            handleBooking
                        }
                        disabled={
                            paymentLoading ||
                            bookingLoading
                        }
                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {paymentLoading ||
                            bookingLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-6 h-6" />
                                Confirm Booking
                            </>
                        )}
                    </button>
                </div>

                {/* RIGHT */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-fit sticky top-5">
                    <h2 className="text-2xl font-bold mb-6">
                        Flight Summary
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-lg font-bold">
                                        {
                                            flight.airline
                                        }
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        {
                                            flight.flightNumber
                                        }
                                    </p>
                                </div>

                                <Plane className="w-8 h-8 text-blue-300" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            flight
                                                .route
                                                .from
                                                .code
                                        }
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        {
                                            flight
                                                .route
                                                .from
                                                .city
                                        }
                                    </p>
                                </div>

                                <ArrowRight className="text-blue-300" />

                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        {
                                            flight
                                                .route
                                                .to
                                                .code
                                        }
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        {
                                            flight
                                                .route
                                                .to
                                                .city
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PRICE */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-700/20 rounded-2xl p-5 border border-blue-500/20">
                            <p className="text-sm text-slate-300 mb-2">
                                Total Amount
                            </p>

                            <h3 className="text-4xl font-extrabold text-white">
                                {
                                    flight.price
                                }
                            </h3>
                        </div>

                        {/* SUCCESS */}
                        {success &&
                            bookingDetails && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <CheckCircle className="text-emerald-400" />

                                        <h3 className="font-bold text-emerald-300">
                                            Booking Confirmed
                                        </h3>
                                    </div>

                                    <p className="text-sm text-slate-300">
                                        Booking Reference
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {
                                            bookingDetails?.bookingReference
                                        }
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightBooking;