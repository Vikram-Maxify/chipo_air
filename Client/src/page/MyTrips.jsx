// pages/MyTrips.jsx

import {
    useState,
} from "react";

import {
    CalendarDays,
    Plane,
    MapPin,
    Clock3,
    Hotel,
    Ticket,
    X,
} from "lucide-react";

const trips = [
    {
        id: 1,
        type: "Flight",
        title: "Delhi → Dubai",
        bookingId: "GB12345678",
        date: "18 May 2026",
        time: "08:45 AM",
        status: "Upcoming",
        image:
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1400&auto=format&fit=crop",
        traveller: "Vikram Thakur",
        airline: "Emirates",
        seat: "12A",
        terminal: "T3",
    },

    {
        id: 2,
        type: "Hotel",
        title: "The Palm Resort, Goa",
        bookingId: "HT98765432",
        date: "25 May 2026",
        time: "Check-in 02:00 PM",
        status: "Confirmed",
        image:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop",
        traveller: "Vikram Thakur",
        room: "Deluxe Suite",
        guests: "2 Guests",
    },

    {
        id: 3,
        type: "Holiday",
        title: "Maldives Honeymoon Package",
        bookingId: "PK24681357",
        date: "03 Jun 2026",
        time: "5 Nights / 6 Days",
        status: "Completed",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
        traveller: "Vikram Thakur",
        packageType:
            "Premium Beach Villa",
    },
];

const MyTrips = () => {

    const [selectedTrip,
        setSelectedTrip] =
        useState(null);

    return (
        <div className="min-h-screen bg-[#f5f7fb] py-8 px-3">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="mb-8">

                    <h1 className="text-3xl md:text-4xl font-bold text-[#1f1f1f]">
                        My Trips
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Manage your
                        upcoming &
                        completed trips
                    </p>
                </div>

                {/* TRIPS */}

                <div className="flex flex-col gap-6">

                    {trips.map(
                        (
                            trip
                        ) => (

                            <div
                                key={
                                    trip.id
                                }
                                className="bg-white rounded-[28px] border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300"
                            >

                                <div className="flex flex-col lg:flex-row">

                                    {/* IMAGE */}

                                    <div className="relative lg:w-[340px]">

                                        <img
                                            src={
                                                trip.image
                                            }
                                            alt={
                                                trip.title
                                            }
                                            className="w-full h-[240px] lg:h-full object-cover"
                                        />

                                        <div
                                            className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-md ${
                                                trip.status ===
                                                "Upcoming"
                                                    ? "bg-[#2276e3] text-white"
                                                    : trip.status ===
                                                      "Confirmed"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-800 text-white"
                                            }`}
                                        >
                                            {
                                                trip.status
                                            }
                                        </div>
                                    </div>

                                    {/* CONTENT */}

                                    <div className="flex-1 p-6 md:p-8">

                                        {/* TYPE */}

                                        <div className="flex items-center gap-2 text-[#2276e3] font-semibold text-sm mb-3">

                                            {trip.type ===
                                            "Flight" ? (
                                                <Plane
                                                    size={
                                                        18
                                                    }
                                                />
                                            ) : trip.type ===
                                              "Hotel" ? (
                                                <Hotel
                                                    size={
                                                        18
                                                    }
                                                />
                                            ) : (
                                                <Ticket
                                                    size={
                                                        18
                                                    }
                                                />
                                            )}

                                            <span>
                                                {
                                                    trip.type
                                                }
                                            </span>
                                        </div>

                                        {/* TITLE */}

                                        <h2 className="text-2xl md:text-3xl font-bold text-[#1f1f1f] leading-tight">

                                            {
                                                trip.title
                                            }

                                        </h2>

                                        {/* BOOKING */}

                                        <div className="mt-3 inline-flex items-center bg-[#f3f7ff] text-[#2276e3] px-4 py-2 rounded-xl text-sm font-medium">

                                            Booking ID:
                                            {" "}
                                            {
                                                trip.bookingId
                                            }

                                        </div>

                                        {/* DETAILS */}

                                        <div className="flex flex-wrap items-center gap-6 mt-6 text-gray-600">

                                            <div className="flex items-center gap-2">

                                                <CalendarDays
                                                    size={
                                                        18
                                                    }
                                                />

                                                <span>
                                                    {
                                                        trip.date
                                                    }
                                                </span>

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <Clock3
                                                    size={
                                                        18
                                                    }
                                                />

                                                <span>
                                                    {
                                                        trip.time
                                                    }
                                                </span>

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <MapPin
                                                    size={
                                                        18
                                                    }
                                                />

                                                <span>
                                                    India
                                                </span>

                                            </div>
                                        </div>

                                        {/* BUTTONS */}

                                        <div className="flex flex-wrap gap-4 mt-8">

                                            <button
                                                onClick={() =>
                                                    setSelectedTrip(
                                                        trip
                                                    )
                                                }
                                                className="bg-[#2276e3] text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition duration-300"
                                            >
                                                View
                                                Details
                                            </button>

                                            <button className="border border-gray-300 text-[#1f1f1f] px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition duration-300">
                                                Download
                                                Ticket
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* POPUP */}

            {selectedTrip && (

                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">

                    <div className="bg-white w-full max-w-3xl rounded-[30px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                        {/* IMAGE */}

                        <div className="relative">

                            <img
                                src={
                                    selectedTrip.image
                                }
                                alt={
                                    selectedTrip.title
                                }
                                className="w-full h-[260px] object-cover"
                            />

                            {/* CLOSE */}

                            <button
                                onClick={() =>
                                    setSelectedTrip(
                                        null
                                    )
                                }
                                className="absolute top-4 right-4 bg-white/90 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                            >
                                <X
                                    size={
                                        22
                                    }
                                />
                            </button>
                        </div>

                        {/* CONTENT */}

                        <div className="p-6 md:p-8">

                            {/* TYPE */}

                            <div className="inline-flex items-center gap-2 bg-[#f3f7ff] text-[#2276e3] px-4 py-2 rounded-xl text-sm font-semibold mb-4">

                                {selectedTrip.type ===
                                "Flight" ? (
                                    <Plane
                                        size={
                                            18
                                        }
                                    />
                                ) : selectedTrip.type ===
                                  "Hotel" ? (
                                    <Hotel
                                        size={
                                            18
                                        }
                                    />
                                ) : (
                                    <Ticket
                                        size={
                                            18
                                        }
                                    />
                                )}

                                <span>
                                    {
                                        selectedTrip.type
                                    }
                                </span>
                            </div>

                            {/* TITLE */}

                            <h2 className="text-3xl font-bold text-[#1f1f1f]">
                                {
                                    selectedTrip.title
                                }
                            </h2>

                            {/* GRID */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                                <div className="bg-[#f8faff] p-5 rounded-2xl">

                                    <p className="text-gray-500 text-sm">
                                        Booking
                                        ID
                                    </p>

                                    <h3 className="text-xl font-bold mt-1">
                                        {
                                            selectedTrip.bookingId
                                        }
                                    </h3>
                                </div>

                                <div className="bg-[#f8faff] p-5 rounded-2xl">

                                    <p className="text-gray-500 text-sm">
                                        Traveller
                                    </p>

                                    <h3 className="text-xl font-bold mt-1">
                                        {
                                            selectedTrip.traveller
                                        }
                                    </h3>
                                </div>

                                <div className="bg-[#f8faff] p-5 rounded-2xl">

                                    <p className="text-gray-500 text-sm">
                                        Date
                                    </p>

                                    <h3 className="text-xl font-bold mt-1">
                                        {
                                            selectedTrip.date
                                        }
                                    </h3>
                                </div>

                                <div className="bg-[#f8faff] p-5 rounded-2xl">

                                    <p className="text-gray-500 text-sm">
                                        Time
                                    </p>

                                    <h3 className="text-xl font-bold mt-1">
                                        {
                                            selectedTrip.time
                                        }
                                    </h3>
                                </div>

                                {selectedTrip.airline && (

                                    <div className="bg-[#f8faff] p-5 rounded-2xl">

                                        <p className="text-gray-500 text-sm">
                                            Airline
                                        </p>

                                        <h3 className="text-xl font-bold mt-1">
                                            {
                                                selectedTrip.airline
                                            }
                                        </h3>
                                    </div>

                                )}

                                {selectedTrip.seat && (

                                    <div className="bg-[#f8faff] p-5 rounded-2xl">

                                        <p className="text-gray-500 text-sm">
                                            Seat
                                        </p>

                                        <h3 className="text-xl font-bold mt-1">
                                            {
                                                selectedTrip.seat
                                            }
                                        </h3>
                                    </div>

                                )}
                            </div>

                            {/* FOOTER */}

                            <div className="flex justify-end mt-8">

                                <button
                                    onClick={() =>
                                        setSelectedTrip(
                                            null
                                        )
                                    }
                                    className="bg-[#2276e3] text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTrips;