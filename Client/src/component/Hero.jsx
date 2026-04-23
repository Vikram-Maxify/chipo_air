import React, { useState } from "react";
import { Calendar, Users, Search, ArrowLeftRight } from "lucide-react";
import { cities, passengersList, tripTypes } from "./mockData";

const Hero = () => {
    const [tripType, setTripType] = useState("roundtrip");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [passengers, setPassengers] = useState(1);

    const swapLocations = () => {
        setFrom(to);
        setTo(from);
    };

    return (
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white">

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">

                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 leading-tight">
                        Find Your Perfect Flight ✈️
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-blue-100">
                        Compare prices & book cheapest flights instantly
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-white text-black rounded-2xl shadow-xl p-4 sm:p-6">

                    {/* Trip Type */}
                    <div className="flex flex-wrap gap-2 mb-5 justify-center md:justify-start">
                        {tripTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setTripType(type.id)}
                                className={`px-4 py-2 rounded-full text-sm transition ${tripType === type.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Form */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">

                        {/* From */}
                        <div className="lg:col-span-3">
                            <label className="text-sm text-gray-500">From</label>
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.code} value={city.name}>
                                        {city.name} ({city.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Swap Button */}
                        <div className="hidden lg:flex items-end justify-center">
                            <button
                                onClick={swapLocations}
                                className="p-3 border rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeftRight size={18} />
                            </button>
                        </div>

                        {/* To */}
                        <div className="lg:col-span-3">
                            <label className="text-sm text-gray-500">To</label>
                            <select
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.code} value={city.name}>
                                        {city.name} ({city.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Departure */}
                        <div className="lg:col-span-2">
                            <label className="text-sm text-gray-500">Departure</label>
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    className="w-full border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Return */}
                        {tripType === "roundtrip" && (
                            <div className="lg:col-span-2">
                                <label className="text-sm text-gray-500">Return</label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Passengers */}
                        <div className="lg:col-span-2">
                            <label className="text-sm text-gray-500">Passengers</label>
                            <div className="relative mt-1">
                                <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                                <select
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                    className="w-full border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
                                >
                                    {passengersList.map((num) => (
                                        <option key={num} value={num}>
                                            {num} Passenger
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="lg:col-span-12">
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                                <Search size={18} />
                                Search Flights
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;