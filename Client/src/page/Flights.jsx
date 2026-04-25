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
        });

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-600";
            case "scheduled":
                return "bg-blue-100 text-blue-600";
            case "landed":
                return "bg-gray-200 text-gray-700";
            default:
                return "bg-orange-100 text-orange-600";
        }
    };

    const getDelayText = (delay) => {
        if (!delay || delay === "On Time") return "On Time";
        if (typeof delay === "number") return `${delay} min delay`;
        return delay;
    };

    if (loading) return <div className="p-6 text-center">Loading flights...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <>

            <div className="bg-gray-50 min-h-screen py-6 px-3 md:px-6">
                <div className="max-w-6xl mx-auto">

                    <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                        ✈️ Available Flights
                    </h2>

                    <div className="space-y-4">

                        {flights.map((f, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 md:p-5 flex flex-col md:flex-row justify-between gap-4 border border-gray-100"
                            >

                                {/* LEFT */}
                                <div className="flex flex-col gap-1 md:w-1/4">
                                    <p className="font-semibold text-lg">
                                        {f.airline}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {f.flightNumber}
                                    </p>

                                    <span className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusColor(f.status)}`}>
                                        {f.status.toUpperCase()}
                                    </span>
                                </div>

                                {/* CENTER */}
                                <div className="flex flex-col md:flex-row items-center justify-between md:w-2/4 gap-4">

                                    {/* FROM */}
                                    <div className="text-center max-w-[120px]">
                                        <p className="text-lg font-semibold">
                                            {formatTime(f.timing.departure.scheduled)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(f.timing.departure.scheduled)}
                                        </p>

                                        <p className="font-bold text-blue-600 mt-1">
                                            {f.route.from.code}
                                        </p>

                                        <p className="text-[11px] text-gray-500 line-clamp-2">
                                            {f.route.from.city}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            T-{f.route.from.terminal}
                                        </p>
                                    </div>

                                    {/* FLIGHT LINE */}
                                    <div className="flex flex-col items-center">
                                        <p className="text-xs text-gray-500 mb-1">
                                            {getDelayText(f.timing.departure.delay)}
                                        </p>

                                        <div className="relative w-24 md:w-32 h-[2px] bg-gray-300">
                                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">
                                                ✈️
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {getDelayText(f.timing.arrival.delay)}
                                        </p>
                                    </div>

                                    {/* TO */}
                                    <div className="text-center max-w-[120px]">
                                        <p className="text-lg font-semibold">
                                            {formatTime(f.timing.arrival.scheduled)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(f.timing.arrival.scheduled)}
                                        </p>

                                        <p className="font-bold text-blue-600 mt-1">
                                            {f.route.to.code}
                                        </p>

                                        <p className="text-[11px] text-gray-500 line-clamp-2">
                                            {f.route.to.city}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            T-{f.route.to.terminal}
                                        </p>
                                    </div>

                                </div>

                                {/* RIGHT */}
                                <div className="flex md:flex-col items-center md:items-end justify-between md:w-1/4 gap-3">

                                    <p className="text-xl md:text-2xl font-bold text-blue-600">
                                        ₹{Math.floor(Math.random() * 4000) + 2500}
                                    </p>

                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition w-full md:w-auto">
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