import React from "react";
import { useSelector } from "react-redux";
import Header from "../component/Header";

const Flights = () => {
    const { flights, loading, error } = useSelector(
        (state) => state.flights
    );

    const formatTime = (date) =>
        new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    if (loading) {
        return <div className="p-6 text-center">Loading flights...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!loading && flights.length === 0) {
        return <div className="p-6 text-center">No flights found</div>;
    }

    return (
        <>
        <Header/>
        
        <div className="bg-gray-100 min-h-screen py-6 px-4">

            <div className="max-w-6xl mx-auto">

                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                    Available Flights ✈️
                </h2>

                <div className="space-y-5">

                    {flights.map((f, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 flex flex-col md:flex-row justify-between items-center gap-6"
                        >

                            {/* LEFT: Airline */}
                            <div className="flex flex-col items-center md:items-start w-full md:w-1/4">
                                <p className="font-semibold text-lg">{f.airline}</p>
                                <p className="text-sm text-gray-500">{f.flight}</p>
                            </div>

                            {/* CENTER: Time + Route */}
                            <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-2/4 gap-6">

                                {/* Departure */}
                                <div className="text-center">
                                    <p className="text-xl font-semibold">
                                        {formatTime(f.departure)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(f.departure)}
                                    </p>
                                    <p className="text-xs mt-1 font-medium">{f.from}</p>
                                </div>

                                {/* Route Line */}
                                <div className="flex flex-col items-center">
                                    <div className="text-xs text-gray-400 mb-1">
                                        {f.status}
                                    </div>
                                    <div className="w-20 h-[1px] bg-gray-300 relative">
                                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">
                                            ✈️
                                        </span>
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div className="text-center">
                                    <p className="text-xl font-semibold">
                                        {formatTime(f.arrival)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(f.arrival)}
                                    </p>
                                    <p className="text-xs mt-1 font-medium">{f.to}</p>
                                </div>

                            </div>

                            {/* RIGHT: Price + CTA */}
                            <div className="flex flex-col items-center md:items-end w-full md:w-1/4">

                                <p className="text-2xl font-bold text-blue-600">
                                    ₹{f.price}
                                </p>

                                <p className="text-xs text-gray-500 mb-2">
                                    per person
                                </p>

                                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                                    Book Now
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
        </>
    );
};

export default Flights;