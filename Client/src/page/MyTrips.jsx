// pages/MyTrips.jsx

import {
    CalendarDays,
    Plane,
    MapPin,
    Clock3,
    Hotel,
    Ticket,
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
    },
];

const MyTrips = () => {

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

                                        {/* STATUS */}

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

                                        {/* BOOKING ID */}

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

                                                <span className="text-sm md:text-base">
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

                                                <span className="text-sm md:text-base">
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

                                                <span className="text-sm md:text-base">
                                                    India
                                                </span>

                                            </div>
                                        </div>

                                        {/* BUTTONS */}

                                        <div className="flex flex-wrap gap-4 mt-8">

                                            <button className="bg-[#2276e3] text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition duration-300">

                                                View Details

                                            </button>

                                            <button className="border border-gray-300 text-[#1f1f1f] px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition duration-300">

                                                Download Ticket

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTrips;