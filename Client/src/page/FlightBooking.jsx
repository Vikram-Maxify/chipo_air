import React, { useState, useEffect } from "react";

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
    Plus,
    Trash2,
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
    const { user } = useSelector((state) => state.auth);

    // FLIGHTS
    const { flights } = useSelector((state) => state.flights);

    // BOOKING STORE
    const {
        loading: bookingLoading,
        success,
        error,
        bookingDetails,
    } = useSelector((state) => state.flightBooking);

    // PAYMENT STORE
    const { loading: paymentLoading } = useSelector((state) => state.payment);

    // CURRENT FLIGHT
    const flight = location.state?.flight || flights.find((f) => f.offerId === id);

    // AVAILABLE SEATS
    const availableSeats = location.state?.availableSeats || [];

    // Check if seat selection is required/enabled
    const hasSeatsAvailable = availableSeats.length > 0 && availableSeats.some(seat => seat.available);

    // SELECTED SEATS
    const [selectedSeats, setSelectedSeats] = useState([]);

    // SELECT SEAT (only if seats are available)
    const handleSeatSelect = (seat, passenger) => {
        if (!hasSeatsAvailable) return;

        // REMOVE OLD
        const filteredSeats = selectedSeats.filter(
            (s) => s.passengerId !== passenger.id
        );

        // ADD NEW
        setSelectedSeats([
            ...filteredSeats,
            {
                seatId: seat.seatId,
                seatNumber: seat.seatNumber,
                seatServiceId: seat.seatServiceId,
                passengerId: passenger.id,
                cabin: seat.cabin,
                price: Number(seat.price) || 0,
                currency: seat.currency || "INR",
            },
        ]);
    };

    // TOTAL SEAT PRICE
    const totalSeatAmount = selectedSeats.reduce(
        (total, seat) => total + Number(seat.price || 0),
        0
    );

    // REAL DUFFEL PASSENGERS
    const realPassengers = location.state?.passengers || [];

    // Calculate base flight amount per passenger
    const baseFlightPrice = parseFloat(flight?.price?.split(" ")?.[0]) || 0;
    const usdToInrRate = 83;
    const flightAmountPerPassenger = Math.round(baseFlightPrice * usdToInrRate);
    const totalFlightAmount = flightAmountPerPassenger * (realPassengers.length || 1);
    const finalAmount = totalFlightAmount + totalSeatAmount;

    // PASSENGERS STATE
    const [passengers, setPassengers] = useState([]);

    // Initialize passengers when realPassengers changes
    useEffect(() => {
        if (realPassengers.length > 0) {
            setPassengers(
                realPassengers.map((passenger, index) => ({
                    id: passenger.passengerId || `temp_${Date.now()}_${index}`,
                    passengerNo: passenger.passengerNo || index + 1,
                    type: passenger.type || "adult",
                    title: "mr",
                    firstName: "",
                    lastName: "",
                    email: user?.email || "",
                    phone: "",
                    gender: "m",
                    born_on: "",
                }))
            );
        } else {
            setPassengers([
                {
                    id: `temp_${Date.now()}_0`,
                    passengerNo: 1,
                    type: "adult",
                    title: "mr",
                    firstName: "",
                    lastName: "",
                    email: user?.email || "",
                    phone: "",
                    gender: "m",
                    born_on: "",
                },
            ]);
        }
    }, [realPassengers, user?.email]);

    // NO FLIGHT
    if (!flight) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-3">No Flight Selected</h1>
                    <button
                        onClick={() => navigate("/flights")}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // INPUT CHANGE
    const handleChange = (index, e) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][e.target.name] = e.target.value;
        setPassengers(updatedPassengers);
    };

    // ADD PASSENGER
    const addPassenger = () => {
        if (passengers.length >= realPassengers.length && realPassengers.length > 0) {
            alert("Maximum passengers reached");
            return;
        }

        const nextIndex = passengers.length;
        const realPassenger = realPassengers[nextIndex];

        setPassengers([
            ...passengers,
            {
                id: realPassenger?.passengerId || `temp_${Date.now()}_${nextIndex}`,
                passengerNo: nextIndex + 1,
                type: realPassenger?.type || "adult",
                title: "mr",
                firstName: "",
                lastName: "",
                email: user?.email || "",
                phone: "",
                gender: "m",
                born_on: "",
            },
        ]);
    };

    // REMOVE PASSENGER
    const removePassenger = (index) => {
        if (passengers.length === 1) {
            alert("At least one passenger is required");
            return;
        }

        const updatedPassengers = passengers.filter((_, i) => i !== index);
        // Re-index passenger numbers
        const reindexedPassengers = updatedPassengers.map((p, i) => ({
            ...p,
            passengerNo: i + 1,
        }));
        setPassengers(reindexedPassengers);

        // Also remove seat selections for removed passenger
        const removedPassengerId = passengers[index].id;
        setSelectedSeats(prev => prev.filter(seat => seat.passengerId !== removedPassengerId));
    };

    // Validate phone number
    const formatPhoneNumber = (phone) => {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("91") && cleaned.length === 12) {
            return `+${cleaned}`;
        }
        if (cleaned.length === 10) {
            return `+91${cleaned}`;
        }
        if (cleaned.startsWith("+")) {
            return phone;
        }
        return `+91${cleaned}`;
    };

    // HANDLE BOOKING
    // HANDLE BOOKING
    const handleBooking = async () => {
        try {
            // VALIDATION - Check all passengers have required fields
            for (let i = 0; i < passengers.length; i++) {
                const p = passengers[i];
                if (!p.firstName?.trim()) {
                    alert(`Please enter first name for passenger ${i + 1}`);
                    return;
                }
                if (!p.lastName?.trim()) {
                    alert(`Please enter last name for passenger ${i + 1}`);
                    return;
                }
                if (!p.email?.trim()) {
                    alert(`Please enter email for passenger ${i + 1}`);
                    return;
                }
                if (!p.phone?.trim()) {
                    alert(`Please enter phone number for passenger ${i + 1}`);
                    return;
                }
                if (!p.born_on) {
                    alert(`Please enter date of birth for passenger ${i + 1}`);
                    return;
                }
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(p.email)) {
                    alert(`Please enter valid email for passenger ${i + 1}`);
                    return;
                }
                // Phone validation
                const phoneDigits = p.phone.replace(/\D/g, "");
                if (phoneDigits.length < 10) {
                    alert(`Please enter valid phone number for passenger ${i + 1}`);
                    return;
                }
            }

            // Validate seat selection ONLY if seats are available
            if (hasSeatsAvailable) {
                for (let i = 0; i < passengers.length; i++) {
                    const passenger = passengers[i];
                    const hasSeat = selectedSeats.find(s => s.passengerId === passenger.id);
                    if (!hasSeat) {
                        alert(`Please select a seat for passenger ${i + 1}`);
                        return;
                    }
                }
            }

            // GENERATE UNIQUE PASSENGER IDS
            const updatedPassengers = passengers.map((p, index) => ({
                ...p,
                id: p.id?.startsWith("temp_") ? undefined : p.id,
                phone_number: formatPhoneNumber(p.phone),
                given_name: p.firstName,
                family_name: p.lastName,
            }));

            // ==============================================
            // ✅ FIXED PAYLOAD - Matching backend expectations
            // ==============================================
            const paymentPayload = {
                // Required fields from backend validation
                passengers: updatedPassengers,
                airline: flight.airline,
                flightNumber: flight.flightNumber,
                from: flight.route?.from?.code || flight.from,
                to: flight.route?.to?.code || flight.to,
                amount: totalFlightAmount, // Base flight amount (without seats)
                offerId: flight.offerId,

                // Optional fields
                selectedSeats: hasSeatsAvailable ? selectedSeats.map(seat => ({
                    seatId: seat.seatId,
                    seatNumber: seat.seatNumber,
                    passengerId: seat.passengerId,
                    price: seat.price,
                    cabin: seat.cabin
                })) : []
            };

            console.log("Sending payment payload:", paymentPayload);

            // CREATE PAYMENT
            const paymentResult = await dispatch(createPayment(paymentPayload));

            if (!createPayment.fulfilled.match(paymentResult)) {
                alert(paymentResult.payload?.message || "Payment creation failed");
                return;
            }

            const { order, key, priceBreakup } = paymentResult.payload;

            // Use the total from priceBreakup or calculate
            const razorpayAmount = paymentResult.payload.order?.amount || (finalAmount * 100);

            // LOAD RAZORPAY SCRIPT IF NOT LOADED
            if (!window.Razorpay) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            // RAZORPAY OPTIONS
            const options = {
                key: key,
                amount: razorpayAmount,
                currency: "INR",
                name: "Flight Booking",
                description: `${flight.airline} - ${flight.flightNumber}`,
                order_id: order.id,
                prefill: {
                    name: `${updatedPassengers[0].firstName} ${updatedPassengers[0].lastName}`,
                    email: updatedPassengers[0].email,
                    contact: formatPhoneNumber(updatedPassengers[0].phone).replace("+", ""),
                },
                handler: async function (response) {
                    try {
                        // VERIFY PAYMENT
                        const verifyResult = await dispatch(
                            verifyPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            })
                        );

                        if (!verifyPayment.fulfilled.match(verifyResult)) {
                            alert("Payment verification failed. Please contact support.");
                            return;
                        }

                        // CREATE BOOKING
                        const bookingPayload = {
                            offerId: flight.offerId,
                            passengers: updatedPassengers,
                            selectedSeats: hasSeatsAvailable ? selectedSeats : [],
                            flight: {
                                offerId: flight.offerId,
                                airline: flight.airline,
                                flightNumber: flight.flightNumber,
                                from: flight.route?.from || flight.from,
                                to: flight.route?.to || flight.to,
                                departureTime: flight.departureTime,
                                arrivalTime: flight.arrivalTime,
                                price: flight.price,
                            },
                            payment: {
                                amount: finalAmount,
                                currency: "INR",
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                            },
                        };

                        const bookingResult = await dispatch(
                            createFlightBookingThunk(bookingPayload)
                        );

                        if (createFlightBookingThunk.fulfilled.match(bookingResult)) {
                            alert("Flight booked successfully!");
                            navigate(`/booking-confirmation/${bookingResult.payload.bookingReference}`);
                        } else {
                            alert(bookingResult.payload?.message || "Booking failed. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Booking error:", error);
                        alert("Booking failed. Please contact support.");
                    }
                },
                modal: {
                    ondismiss: async function () {
                        await dispatch(
                            paymentFailed({
                                razorpayOrderId: order.id,
                                errorMessage: "User closed payment popup",
                            })
                        );
                        alert("Payment was cancelled");
                    },
                },
                theme: {
                    color: "#2563eb",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Booking error:", error);
            alert(error.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4 text-white">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
                {/* LEFT - Passenger Details */}
                <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 p-3 rounded-2xl">
                                <Plane className="w-7 h-7 text-blue-300" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Passenger Details</h1>
                                <p className="text-slate-300 text-sm mt-1">
                                    Complete your booking information
                                </p>
                            </div>
                        </div>

                        {(realPassengers.length === 0 || passengers.length < realPassengers.length) && (
                            <button
                                onClick={addPassenger}
                                className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl flex items-center gap-2 transition"
                            >
                                <Plus className="w-5 h-5" />
                                Add Passenger
                            </button>
                        )}
                    </div>

                    {/* PASSENGERS FORM */}
                    {passengers.map((passenger, index) => (
                        <div
                            key={passenger.id || index}
                            className="mb-10 border border-white/10 rounded-3xl p-5"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">
                                    Passenger {passenger.passengerNo}
                                </h2>
                                {passengers.length > 1 && (
                                    <button
                                        onClick={() => removePassenger(index)}
                                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-xl transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                {/* TITLE */}
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">
                                        Title
                                    </label>
                                    <select
                                        name="title"
                                        value={passenger.title}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-blue-500 transition"
                                    >
                                        <option value="mr">Mr</option>
                                        <option value="mrs">Mrs</option>
                                        <option value="ms">Ms</option>
                                    </select>
                                </div>

                                {/* FIRST NAME */}
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">
                                        First Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={passenger.firstName}
                                            onChange={(e) => handleChange(index, e)}
                                            placeholder="Enter first name"
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* LAST NAME */}
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">
                                        Last Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={passenger.lastName}
                                            onChange={(e) => handleChange(index, e)}
                                            placeholder="Enter last name"
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={passenger.email}
                                            onChange={(e) => handleChange(index, e)}
                                            placeholder="Enter email"
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* PHONE */}
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">
                                        Phone *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={passenger.phone}
                                            onChange={(e) => handleChange(index, e)}
                                            placeholder="Enter phone number"
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* DOB */}
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">
                                        Date of Birth *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="date"
                                            name="born_on"
                                            value={passenger.born_on}
                                            onChange={(e) => handleChange(index, e)}
                                            max={new Date().toISOString().split("T")[0]}
                                            min="1900-01-01"
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* GENDER */}
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">
                                        Gender *
                                    </label>
                                    <select
                                        name="gender"
                                        value={passenger.gender}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-blue-500 transition"
                                    >
                                        <option value="m">Male</option>
                                        <option value="f">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* ERROR */}
                    {error && (
                        <div className="mt-5 bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl">
                            {error}
                        </div>
                    )}

                    {/* SEAT SELECTION - Only show if seats are available */}
                    {hasSeatsAvailable && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-5">Select Seats</h2>
                            {passengers.map((passenger, index) => {
                                const selectedSeat = selectedSeats.find(
                                    (s) => s.passengerId === passenger.id
                                );

                                return (
                                    <div key={passenger.id || index} className="mb-8 border border-white/10 rounded-3xl p-5">
                                        <h3 className="text-lg font-bold mb-4">
                                            Passenger {index + 1}
                                        </h3>

                                        {selectedSeat && (
                                            <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-300 rounded-2xl p-3">
                                                Selected Seat: {selectedSeat.seatNumber} | ₹{selectedSeat.price}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                            {availableSeats
                                                .filter((seat) => seat.available)
                                                .map((seat, seatIndex) => {
                                                    const alreadySelectedForOther = selectedSeats.find(
                                                        (s) => s.seatId === seat.seatId && s.passengerId !== passenger.id
                                                    );

                                                    return (
                                                        <button
                                                            key={seatIndex}
                                                            disabled={!!alreadySelectedForOther}
                                                            onClick={() => handleSeatSelect(seat, passenger)}
                                                            className={`p-3 rounded-2xl font-bold border transition-all
                                                                ${alreadySelectedForOther
                                                                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                                                                    : selectedSeat?.seatId === seat.seatId
                                                                        ? "bg-green-600 hover:bg-green-700"
                                                                        : "bg-blue-600 hover:bg-blue-700"
                                                                }`}
                                                        >
                                                            <div>{seat.seatNumber}</div>
                                                            <div className="text-xs mt-1">₹{seat.price}</div>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                        onClick={handleBooking}
                        disabled={paymentLoading || bookingLoading}
                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-70 transition"
                    >
                        {paymentLoading || bookingLoading ? (
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

                {/* RIGHT - Flight Summary */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-fit sticky top-5">
                    <h2 className="text-2xl font-bold mb-6">Flight Summary</h2>

                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-lg font-bold">{flight.airline}</p>
                                    <p className="text-sm text-slate-400">{flight.flightNumber}</p>
                                </div>
                                <Plane className="w-8 h-8 text-blue-300" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">
                                        {flight.route?.from?.code || flight.from}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {flight.route?.from?.city || "Departure"}
                                    </p>
                                </div>

                                <ArrowRight className="text-blue-300" />

                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        {flight.route?.to?.code || flight.to}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {flight.route?.to?.city || "Arrival"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PRICE DETAILS */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-700/20 rounded-2xl p-5 border border-blue-500/20">
                            <p className="text-sm text-slate-300 mb-2">Total Amount</p>
                            <h3 className="text-4xl font-extrabold text-white">
                                ₹{finalAmount.toLocaleString("en-IN")}
                            </h3>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-sm text-slate-300 flex justify-between">
                                    <span>Flight ({passengers.length} passenger{passengers.length > 1 ? "s" : ""})</span>
                                    <span>₹{totalFlightAmount.toLocaleString("en-IN")}</span>
                                </p>

                                {hasSeatsAvailable && (
                                    <>
                                        <p className="text-sm text-slate-300 flex justify-between mt-2">
                                            <span>Seats</span>
                                            <span>₹{totalSeatAmount.toLocaleString("en-IN")}</span>
                                        </p>

                                        {selectedSeats.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-white/10">
                                                <p className="text-xs text-slate-400 mb-2">Seat Details:</p>
                                                {selectedSeats.map((seat, idx) => (
                                                    <p key={idx} className="text-xs text-slate-400">
                                                        Passenger {idx + 1}: Seat {seat.seatNumber} - ₹{seat.price}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SUCCESS MESSAGE */}
                        {success && bookingDetails && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle className="text-emerald-400" />
                                    <h3 className="font-bold text-emerald-300">Booking Confirmed</h3>
                                </div>
                                <p className="text-sm text-slate-300">Booking Reference</p>
                                <p className="font-bold text-lg mt-1">{bookingDetails?.bookingReference}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightBooking;