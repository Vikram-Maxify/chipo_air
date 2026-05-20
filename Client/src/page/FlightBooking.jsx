// ======================================================
// IMPORTS
// ======================================================

import React, {
    useState,
    useEffect,
} from "react";

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
    ArrowRight,
    Trash2,
} from "lucide-react";

import {
    getSeatMapThunk,
    bookFlightThunk,
} from "../reducer/slice/flightsSlice";

// ======================================================
// COMPONENT
// ======================================================

const FlightBooking = () => {

    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const { id } =
        useParams();

    // ======================================================
    // AUTH
    // ======================================================

    const { user } =
        useSelector(
            (state) =>
                state.auth
        );

    // ======================================================
    // FLIGHTS STORE
    // ======================================================

    const {
        flights,
        seats,
        loading:
        flightLoading,
        error,
    } = useSelector(
        (state) =>
            state.flights
    );

    // ======================================================
    // CURRENT FLIGHT
    // ======================================================

    const flight =
        location.state?.flight ||
        flights.find(
            (f) =>
                f.offerId === id
        );

    // ======================================================
    // PASSENGERS
    // ======================================================

    const realPassengers =
        location.state
            ?.passengers || [];

    // ======================================================
    // AVAILABLE SEATS
    // ======================================================

    const availableSeats =
        seats || [];

    const hasSeatsAvailable =
        availableSeats.length >
        0;

    // ======================================================
    // SELECTED SEATS
    // ======================================================

    const [
        selectedSeats,
        setSelectedSeats,
    ] = useState([]);

    // ======================================================
    // PASSENGERS STATE
    // ======================================================

    const [
        passengers,
        setPassengers,
    ] = useState([]);

    // ======================================================
    // INIT PASSENGERS
    // ======================================================

    useEffect(() => {

        if (
            realPassengers
                ?.length > 0
        ) {

            const formatted =
                realPassengers.map(
                    (
                        p,
                        index
                    ) => ({
                        id:
                            p.passengerId ||

                            `temp_${Date.now()}_${index}`,

                        passengerNo:
                            index + 1,

                        type:
                            p.type ||
                            "adult",

                        title:
                            "mr",

                        firstName:
                            "",

                        lastName:
                            "",

                        email:
                            user?.email ||
                            "",

                        phone:
                            "",

                        gender:
                            "m",

                        born_on:
                            "",
                    })
                );

            setPassengers(
                formatted
            );
        }

    }, [
        realPassengers,
        user?.email,
    ]);

    // ======================================================
    // NO FLIGHT
    // ======================================================

    if (!flight) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">

                <div className="text-center">

                    <h1 className="text-3xl font-bold mb-3">
                        No Flight Selected
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

    // ======================================================
    // INPUT CHANGE
    // ======================================================

    const handleChange =
        (
            index,
            e
        ) => {

            const updated =
                [
                    ...passengers,
                ];

            updated[index][
                e.target.name
            ] =
                e.target.value;

            setPassengers(
                updated
            );
        };

    // ======================================================
    // REMOVE PASSENGER
    // ======================================================

    const removePassenger =
        (
            index
        ) => {

            const removedPassengerId =
                passengers[index]
                    .id;

            const updated =
                passengers.filter(
                    (
                        _,
                        i
                    ) =>
                        i !==
                        index
                );

            setPassengers(
                updated
            );

            setSelectedSeats(
                (
                    prev
                ) =>
                    prev.filter(
                        (
                            seat
                        ) =>
                            seat.passengerId !==
                            removedPassengerId
                    )
            );
        };

    // ======================================================
    // FORMAT PHONE
    // ======================================================

    const formatPhoneNumber =
        (
            phone
        ) => {

            const cleaned =
                phone.replace(
                    /\D/g,
                    ""
                );

            if (
                cleaned.length ===
                10
            ) {

                return `+91${cleaned}`;
            }

            return `+${cleaned}`;
        };

    // ======================================================
    // LOAD SEAT MAP
    // ======================================================

    const loadSeatMapAfterPassenger =
        async () => {

            try {

                // VALIDATION

                for (
                    let i = 0;
                    i <
                    passengers.length;
                    i++
                ) {

                    const p =
                        passengers[i];

                    if (
                        !p.firstName ||
                        !p.lastName ||
                        !p.email ||
                        !p.phone ||
                        !p.born_on
                    ) {

                        alert(
                            `Please complete passenger ${i + 1}`
                        );

                        return;
                    }
                }

                // FORMAT PASSENGERS

                const formattedPassengers =
                    passengers.map(
                        (
                            p
                        ) => ({
                            passengerId:
                                p.id,

                            type:
                                p.type,

                            title:
                                p.title,

                            firstName:
                                p.firstName,

                            lastName:
                                p.lastName,

                            born_on:
                                p.born_on,

                            gender:
                                p.gender,

                            email:
                                p.email,

                            phone:
                                formatPhoneNumber(
                                    p.phone
                                ),
                        })
                    );

                // API CALL

                const result =
                    await dispatch(
                        getSeatMapThunk({

                            offerId:
                                flight.offerId,

                            passengers:
                                formattedPassengers,

                            totalAmount:
                                String(
                                    Number(
                                        flight.totalAmount ||
                                        flight.total_amount ||
                                        flight.price?.split(" ")?.[0] ||
                                        0
                                    )
                                ),

                            currency:
                                "USD",
                        })
                    );
                if (
                    getSeatMapThunk.fulfilled.match(
                        result
                    )
                ) {

                    alert(
                        "Seats loaded successfully"
                    );

                } else {

                    alert(
                        result.payload ||
                        "Seat loading failed"
                    );
                }

            } catch (
            err
            ) {

                console.log(
                    err
                );

                alert(
                    "Seat loading failed"
                );
            }
        };

    // ======================================================
    // SELECT SEAT
    // ======================================================

    const handleSeatSelect =
        (
            seat,
            passenger
        ) => {

            const filtered =
                selectedSeats.filter(
                    (
                        s
                    ) =>
                        s.passengerId !==
                        passenger.id
                );

            setSelectedSeats([
                ...filtered,

                {
                    seatId:
                        seat.seatId,

                    seatNumber:
                        seat.seatNumber,

                    seatServiceId:
                        seat.seatServiceId,

                    passengerId:
                        passenger.id,

                    cabin:
                        seat.cabin,

                    price:
                        Number(
                            seat.price
                        ) || 0,

                    currency:
                        seat.currency ||
                        "USD",
                },
            ]);
        };

    // ======================================================
    // TOTALS
    // ======================================================

    const totalSeatAmount =
        selectedSeats.reduce(
            (
                total,
                seat
            ) =>
                total +
                Number(
                    seat.price ||
                    0
                ),
            0
        );

    const baseFlightPrice =
        parseFloat(
            flight?.totalAmount ||
            flight?.total_amount ||
            0
        );

    const totalFlightAmount =
        baseFlightPrice;

    const finalAmount =
        totalFlightAmount +
        totalSeatAmount;

    // ======================================================
    // HANDLE BOOKING
    // ======================================================

    const handleBooking =
        async () => {

            try {

                // ==========================================
                // VALIDATE SEATS
                // ==========================================

                if (
                    hasSeatsAvailable
                ) {

                    for (
                        let i = 0;
                        i <
                        passengers.length;
                        i++
                    ) {

                        const passenger =
                            passengers[
                            i
                            ];

                        const hasSeat =
                            selectedSeats.find(
                                (
                                    s
                                ) =>
                                    s.passengerId ===
                                    passenger.id
                            );

                        if (
                            !hasSeat
                        ) {

                            alert(
                                `Please select seat for passenger ${i + 1}`
                            );

                            return;
                        }
                    }
                }

                // ==========================================
                // FORMAT PASSENGERS
                // ==========================================

                const updatedPassengers =
                    passengers.map(
                        (
                            p
                        ) => ({
                            ...p,

                            passengerId:
                                p.id,

                            phone:
                                formatPhoneNumber(
                                    p.phone
                                ),
                        })
                    );

                // ==========================================
                // BOOKING PAYLOAD
                // ==========================================

                const bookingPayload =
                {
                    offerId:
                        flight.offerId,

                    passengers:
                        updatedPassengers,

                    selectedSeats,

                    payment:
                    {
                        amount:
                            finalAmount,

                        currency:
                            "USD",

                        paymentId:
                            "MANUAL_PAYMENT",

                        orderId:
                            "MANUAL_ORDER",
                    },

                    flight,
                };

                // ==========================================
                // BOOK FLIGHT
                // ==========================================

                const bookingResult =
                    await dispatch(
                        bookFlightThunk(
                            bookingPayload
                        )
                    );

                // ==========================================
                // SUCCESS
                // ==========================================

                if (
                    bookFlightThunk.fulfilled.match(
                        bookingResult
                    )
                ) {

                    alert(
                        "Flight booked successfully"
                    );

                    navigate(
                        `/booking-confirmation/${bookingResult.payload?.booking?._id}`
                    );

                } else {

                    alert(
                        bookingResult.payload ||
                        "Booking failed"
                    );
                }

            } catch (
            err
            ) {

                console.log(
                    err
                );

                alert(
                    "Booking failed"
                );
            }
        };

    console.log(
        "AVAILABLE SEATS",
        availableSeats
    );

    console.log(
        "SELECTED SEATS",
        selectedSeats
    );

    // ======================================================
    // JSX
    // ======================================================

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

                    {/* PASSENGER FORMS */}

                    {
                        passengers.map(
                            (
                                passenger,
                                index
                            ) => (

                                <div
                                    key={
                                        passenger.id ||
                                        index
                                    }
                                    className="mb-10 border border-white/10 rounded-3xl p-5"
                                >

                                    {/* HEADER */}

                                    <div className="flex items-center justify-between mb-6">

                                        <h2 className="text-xl font-bold">
                                            Passenger {
                                                passenger.passengerNo
                                            }
                                        </h2>

                                        {
                                            passengers.length >
                                            1 && (

                                                <button
                                                    onClick={() =>
                                                        removePassenger(
                                                            index
                                                        )
                                                    }
                                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-xl transition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )
                                        }

                                    </div>

                                    {/* TYPE */}

                                    <div className="mb-5">

                                        <span className="inline-block px-4 py-2 rounded-2xl bg-blue-500/20 text-blue-300 text-sm font-semibold capitalize">
                                            {
                                                passenger.type
                                                    ?.replaceAll(
                                                        "_",
                                                        " "
                                                    )
                                            }
                                        </span>

                                    </div>

                                    {/* FORM */}

                                    <div className="grid md:grid-cols-2 gap-5">

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
                                                    value={
                                                        passenger.firstName
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Enter first name"
                                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
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
                                                    value={
                                                        passenger.lastName
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Enter last name"
                                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
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
                                                    value={
                                                        passenger.email
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Enter email"
                                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
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
                                                    value={
                                                        passenger.phone
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Enter phone"
                                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
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
                                                    value={
                                                        passenger.born_on
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )
                        )
                    }

                    {/* LOAD SEATS */}

                    <button
                        onClick={
                            loadSeatMapAfterPassenger
                        }
                        disabled={
                            flightLoading
                        }
                        className="mb-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold"
                    >
                        {
                            flightLoading
                                ? "Loading Seats..."
                                : "Load Available Seats"
                        }
                    </button>

                    {/* SEAT SELECTION */}

                    {
                        hasSeatsAvailable && (

                            <div className="mt-10">

                                <h2 className="text-2xl font-bold mb-5">
                                    Select Seats
                                </h2>

                                {
                                    passengers.map(
                                        (
                                            passenger,
                                            index
                                        ) => {

                                            const selectedSeat =
                                                selectedSeats.find(
                                                    (
                                                        s
                                                    ) =>
                                                        s.passengerId ===
                                                        passenger.id
                                                );

                                            return (

                                                <div
                                                    key={
                                                        passenger.id ||
                                                        index
                                                    }
                                                    className="mb-8 border border-white/10 rounded-3xl p-5"
                                                >

                                                    <h3 className="text-lg font-bold mb-4">
                                                        Passenger {
                                                            index + 1
                                                        }
                                                    </h3>

                                                    {
                                                        selectedSeat && (

                                                            <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-300 rounded-2xl p-3">
                                                                Selected Seat:
                                                                {" "}
                                                                {
                                                                    selectedSeat.seatNumber
                                                                }
                                                                {" "}
                                                                |
                                                                $
                                                                {
                                                                    selectedSeat.price
                                                                }
                                                            </div>
                                                        )
                                                    }

                                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">

                                                        {
                                                            availableSeats
                                                                .filter(
                                                                    (
                                                                        seat
                                                                    ) =>
                                                                        seat.available
                                                                )
                                                                .map(
                                                                    (
                                                                        seat,
                                                                        seatIndex
                                                                    ) => (

                                                                        <button
                                                                            key={
                                                                                seatIndex
                                                                            }
                                                                            onClick={() =>
                                                                                handleSeatSelect(
                                                                                    seat,
                                                                                    passenger
                                                                                )
                                                                            }
                                                                            className={`p-3 rounded-2xl font-bold border transition-all
                                                                            ${selectedSeat?.seatId ===
                                                                                    seat.seatId
                                                                                    ? "bg-green-600"
                                                                                    : "bg-blue-600"
                                                                                }`}
                                                                        >

                                                                            <div>
                                                                                {
                                                                                    seat.seatNumber
                                                                                }
                                                                            </div>

                                                                            <div className="text-xs mt-1">
                                                                                $
                                                                                {
                                                                                    seat.price
                                                                                }
                                                                            </div>

                                                                        </button>
                                                                    )
                                                                )
                                                        }

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )
                                }

                            </div>
                        )
                    }

                    {/* BOOK BUTTON */}

                    <button
                        onClick={
                            handleBooking
                        }
                        disabled={
                            flightLoading
                        }
                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-4 rounded-2xl font-bold text-lg"
                    >
                        {
                            flightLoading
                                ? "Processing..."
                                : "Confirm Booking"
                        }
                    </button>

                </div>

                {/* RIGHT */}

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-fit sticky top-5">

                    <h2 className="text-2xl font-bold mb-6">
                        Flight Summary
                    </h2>

                    <div className="space-y-6">

                        <div className="bg-white/5 rounded-2xl p-5">

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
                                            flight.route?.from?.code
                                        }
                                    </p>

                                </div>

                                <ArrowRight />

                                <div>

                                    <p className="text-2xl font-bold">
                                        {
                                            flight.route?.to?.code
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* PRICE */}

                        <div className="bg-blue-600/20 rounded-2xl p-5">

                            <p className="flex justify-between">
                                <span>
                                    Flight
                                </span>

                                <span>
                                    $
                                    {
                                        totalFlightAmount
                                    }
                                </span>
                            </p>

                            <p className="flex justify-between mt-2">
                                <span>
                                    Seats
                                </span>

                                <span>
                                    $
                                    {
                                        totalSeatAmount
                                    }
                                </span>
                            </p>

                            <p className="flex justify-between mt-4 text-xl font-bold">
                                <span>
                                    Total
                                </span>

                                <span>
                                    $
                                    {
                                        finalAmount
                                    }
                                </span>
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default FlightBooking;