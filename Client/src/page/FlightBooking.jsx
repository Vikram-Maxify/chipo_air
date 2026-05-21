import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Plane, User, Mail, Phone, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { getSeatMapThunk, bookFlightThunk } from "../reducer/slice/flightsSlice";

// ======================================================
// COMPONENT
// ======================================================

const FlightBooking = () => {
    1

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

const dispatch = useDispatch();

const navigate = useNavigate();

const location = useLocation();

const {
    flight: stateFlight,
    offerId,
    passengersCount,
    passengerCounts,
    passengers: statePassengers,
    availableSeats: stateAvailableSeats,
    seatServices,
} = location.state || {};

const { id } = useParams();

const { user } = useSelector((state) => state.auth);

const {
    flights,
    seats,
    loading: flightLoading,
    error,
} = useSelector((state) => state.flights);

const flight =
    stateFlight ||
    flights.find((f) => f.offerId === id);

const realPassengers = statePassengers || [];

const availableSeats =
    stateAvailableSeats?.length > 0
        ? stateAvailableSeats
        : seats || [];

const hasSeatsAvailable = availableSeats.length > 0;

const [selectedSeats, setSelectedSeats] = useState([]);

const [passengers, setPassengers] = useState([]);

useEffect(() => {
    if (realPassengers?.length > 0) {
        const formatted = realPassengers.map((p, index) => ({
            id: p.passengerId || `temp_${Date.now()}_${index}`,
            passengerNo: index + 1,
            type: p.type || "adult",
            title: "mr",
            firstName: "",
            lastName: "",
            email: user?.email || "",
            phone: "",
            gender: "m",
            born_on: "",
        }));

        setPassengers(formatted);
    }
}, [realPassengers, user?.email]);

if (!flight) {
    return (
        <div className="min-h-screen bg-[#f6f9ff] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                    No Flight Selected
                </h1>

                <button
                    onClick={() => navigate("/flights")}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-white font-semibold transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

const handleChange = (index, e) => {
    const updated = [...passengers];

    updated[index][e.target.name] = e.target.value;

    setPassengers(updated);
};

const removePassenger = (index) => {
    const removedPassengerId = passengers[index].id;

    const updated = passengers.filter((_, i) => i !== index);

    setPassengers(updated);

    setSelectedSeats((prev) =>
        prev.filter((seat) => seat.passengerId !== removedPassengerId)
    );
};

const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 10) return `+91${cleaned}`;

    return `+${cleaned}`;
};

const loadSeatMapAfterPassenger = async () => {
    try {
        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];

            if (!p.firstName || !p.lastName || !p.email || !p.phone || !p.born_on) {
                alert(`Please complete passenger ${i + 1}`);
                return;
            }
        }

        const formattedPassengers = passengers.map((p) => ({
            passengerId: p.id,
            type: p.type,
            title: p.title,
            firstName: p.firstName,
            lastName: p.lastName,
            born_on: p.born_on,
            gender: p.gender,
            email: p.email,
            phone: formatPhoneNumber(p.phone),
        }));

        const result = await dispatch(
            getSeatMapThunk({
                offerId: flight.offerId,
                passengers: formattedPassengers,
                totalAmount: String(
                    Number(
                        flight.totalAmount ||
                        flight.total_amount ||
                        flight.price?.split(" ")?.[0] ||
                        0
                    )
                ),
                currency: "USD",
            })
        );

        if (getSeatMapThunk.fulfilled.match(result)) {
            alert("Seats loaded successfully");
        } else {
            alert(result.payload || "Seat loading failed");
        }

    } catch (err) {
        console.log(err);
        alert("Seat loading failed");
    }
};

const handleSeatSelect = (seat, passenger) => {
    const filtered = selectedSeats.filter((s) => s.passengerId !== passenger.id);

    setSelectedSeats([
        ...filtered,
        {
            seatId: seat.seatId,
            seatNumber: seat.seatNumber,
            seatServiceId: seat.seatServiceId,
            passengerId: passenger.id,
            cabin: seat.cabin,
            price: Number(seat.price) || 0,
            currency: seat.currency || "USD",
        },
    ]);
};

const totalSeatAmount = selectedSeats.reduce(
    (total, seat) => total + Number(seat.price || 0),
    0
);

const baseFlightPrice = parseFloat(
    flight?.totalAmount ||
    flight?.total_amount ||
    0
);

const totalFlightAmount = baseFlightPrice;

const finalAmount = totalFlightAmount + totalSeatAmount;

const handleBooking = async () => {
    try {
        if (hasSeatsAvailable) {
            for (let i = 0; i < passengers.length; i++) {
                const passenger = passengers[i];

                const hasSeat = selectedSeats.find(
                    (s) => s.passengerId === passenger.id
                );

                if (!hasSeat) {
                    alert(`Please select seat for passenger ${i + 1}`);
                    return;
                }
            }
        }

        const updatedPassengers = passengers.map((p) => ({
            ...p,
            passengerId: p.id,
            phone: formatPhoneNumber(p.phone),
        }));

        const bookingPayload = {
            offerId: flight.offerId,
            passengers: updatedPassengers,
            selectedSeats,
            payment: {
                amount: finalAmount,
                currency: "USD",
                paymentId: "MANUAL_PAYMENT",
                orderId: "MANUAL_ORDER",
            },
            flight,
        };

        const bookingResult = await dispatch(
            bookFlightThunk(bookingPayload)
        );

        if (bookFlightThunk.fulfilled.match(bookingResult)) {
            alert("Flight booked successfully");

            navigate(
                `/booking-confirmation/${bookingResult.payload?.booking?._id}`
            );

        } else {
            alert(bookingResult.payload || "Booking failed");
        }

    } catch (err) {
        console.log(err);
        alert("Booking failed");
    }
};

console.log("AVAILABLE SEATS", availableSeats);

console.log("SELECTED SEATS", selectedSeats);

    return (
    <div className="min-h-screen bg-[#f6f9ff] py-6 px-3 md:px-5 text-[#111827]">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_360px] gap-5">

            {/* LEFT */}

            <div className="bg-white border border-slate-200 rounded-[28px] p-4 md:p-6 shadow-sm">

                {/* HEADER */}

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 p-3 rounded-2xl">
                        <Plane className="w-6 h-6 text-blue-600" />
                    </div>

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Passenger Details
                        </h1>

                        <p className="text-slate-500 text-sm mt-1">
                            Complete your booking information
                        </p>
                    </div>

                </div>

                {/* PASSENGERS */}

                {passengers.map((passenger, index) => (

                    <div
                        key={passenger.id || index}
                        className="mb-5 border border-slate-200 rounded-[24px] p-4 md:p-5 bg-white"
                    >

                        {/* TOP */}

                        <div className="flex items-center justify-between mb-4">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                    {passenger.passengerNo}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Passenger {passenger.passengerNo}
                                    </h2>

                                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full capitalize font-medium">
                                        {passenger.type?.replaceAll("_", " ")}
                                    </span>
                                </div>

                            </div>

                            {passengers.length > 1 && (
                                <button
                                    onClick={() => removePassenger(index)}
                                    className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition"
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            )}

                        </div>

                        {/* FORM */}

                        <div className="grid md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    First Name *
                                </label>

                                <div className="relative">

                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={passenger.firstName}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Enter first name"
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500"
                                    />

                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Last Name *
                                </label>

                                <div className="relative">

                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={passenger.lastName}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Enter last name"
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500"
                                    />

                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Email *
                                </label>

                                <div className="relative">

                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                    <input
                                        type="email"
                                        name="email"
                                        value={passenger.email}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Enter email"
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500"
                                    />

                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Phone *
                                </label>

                                <div className="relative">

                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={passenger.phone}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Enter phone number"
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500"
                                    />

                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Date of Birth *
                                </label>

                                <div className="relative">

                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                    <input
                                        type="date"
                                        name="born_on"
                                        value={passenger.born_on}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500"
                                    />

                                </div>
                            </div>

                        </div>

                    </div>
                ))}

                {/* LOAD SEAT */}

                <button
                    onClick={loadSeatMapAfterPassenger}
                    disabled={flightLoading}
                    className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                    {flightLoading ? "Loading Seats..." : "Load Available Seats"}
                </button>

                {/* SEATS */}

                {hasSeatsAvailable && (

                    <div className="mt-8">

                        <h2 className="text-2xl font-bold text-slate-900 mb-5">
                            Select Seats
                        </h2>

                        {passengers.map((passenger, index) => {

                            const selectedSeat = selectedSeats.find(
                                (s) => s.passengerId === passenger.id
                            );

                            return (
                                <div
                                    key={passenger.id || index}
                                    className="mb-5 border border-slate-200 rounded-[24px] p-4"
                                >

                                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                                        Passenger {index + 1}
                                    </h3>

                                    {selectedSeat && (
                                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-3">
                                            Selected Seat: {selectedSeat.seatNumber} | ${selectedSeat.price}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">

                                        {availableSeats
                                            .filter((seat) => seat.available)
                                            .map((seat, seatIndex) => (

                                                <button
                                                    key={seatIndex}
                                                    onClick={() => handleSeatSelect(seat, passenger)}
                                                    className={`p-3 rounded-2xl border font-semibold transition-all ${
                                                        selectedSeat?.seatId === seat.seatId
                                                            ? "bg-green-500 text-white border-green-500"
                                                            : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                                                    }`}
                                                >

                                                    <div>{seat.seatNumber}</div>

                                                    <div className="text-xs mt-1">
                                                        ${seat.price}
                                                    </div>

                                                </button>
                                            ))}
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

                {/* BOOK BUTTON */}

                <button
                    onClick={handleBooking}
                    disabled={flightLoading}
                    className="w-full mt-6 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition"
                >
                    {flightLoading ? "Processing..." : "Confirm Booking"}
                </button>

            </div>

            {/* RIGHT */}

            <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm h-fit sticky top-5">

                <h2 className="text-2xl font-bold text-slate-900 mb-5">
                    Flight Summary
                </h2>

                <div className="space-y-5">

                    <div className="bg-[#f8fbff] border border-slate-200 rounded-[24px] p-5">

                        <div className="flex items-center justify-between mb-5">

                            <div>
                                <p className="text-lg font-bold text-slate-900">
                                    {flight.airline}
                                </p>

                                <p className="text-sm text-slate-500">
                                    {flight.flightNumber}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                                <Plane className="w-6 h-6 text-blue-600" />
                            </div>

                        </div>

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {flight.route?.from?.code}
                                </p>
                            </div>

                            <ArrowRight className="text-slate-400" />

                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {flight.route?.to?.code}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* PRICE */}

                    <div className="bg-blue-50 border border-blue-100 rounded-[24px] p-5">

                        <p className="flex items-center justify-between text-slate-700">
                            <span>Flight</span>
                            <span className="font-semibold">${totalFlightAmount}</span>
                        </p>

                        <p className="flex items-center justify-between text-slate-700 mt-3">
                            <span>Seats</span>
                            <span className="font-semibold">${totalSeatAmount}</span>
                        </p>

                        <div className="h-px bg-blue-100 my-4" />

                        <p className="flex items-center justify-between text-xl font-bold text-slate-900">
                            <span>Total</span>
                            <span>${finalAmount}</span>
                        </p>

                    </div>

                </div>

            </div>

        </div>

    </div>
);
};

export default FlightBooking;