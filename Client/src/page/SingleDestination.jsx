// src/pages/client/SingleDestination.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, CalendarDays, ArrowLeft, Plane, Globe, Clock } from "lucide-react";
import { getSingleDestination } from "../reducer/slice/destinationSlice";

const SingleDestination = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { destination, loading } = useSelector(
        (state) => state.destination
    );

    useEffect(() => {
        if (id) {
            dispatch(getSingleDestination(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
                Loading...
            </div>
        );
    }

    if (!destination) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
                Destination Not Found
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen">

            {/* HERO */}
            <div className="relative h-[75vh] overflow-hidden">

                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all text-white p-3 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* CONTENT */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">

                    <div className="max-w-3xl">

                        <div className="flex items-center gap-2 text-white/90 mb-3">

                            <MapPin className="w-5 h-5 text-red-400" />

                            <p className="uppercase tracking-widest text-sm font-semibold">
                                {destination.cityName}, {destination.countryName}
                            </p>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white capitalize leading-tight mb-5">
                            {destination.name}
                        </h1>

                        <p className="text-lg text-gray-200 leading-relaxed max-w-2xl">
                            {destination.description}
                        </p>

                        <div className="flex items-center gap-4 mt-8 flex-wrap">

                            <button className="bg-blue-600 hover:bg-blue-700 transition-all px-8 py-4 rounded-2xl text-white font-bold flex items-center gap-3 shadow-2xl">

                                <Plane className="w-5 h-5" />

                                Book Your Trip
                            </button>

                            <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl">

                                <p className="text-sm text-gray-200">
                                    Starting From
                                </p>

                                <h2 className="text-3xl font-black text-white">
                                    ₹ {destination.price?.toLocaleString()}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAILS */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2">

                        {/* ABOUT */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">

                            <h2 className="text-3xl font-bold text-gray-900 mb-5">
                                About This Destination
                            </h2>

                            <p className="text-gray-600 leading-8 text-lg">
                                {destination.description}
                            </p>
                        </div>

                        {/* HIGHLIGHTS */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Trip Highlights
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                <div className="bg-blue-50 rounded-2xl p-5">
                                    <Globe className="w-10 h-10 text-blue-600 mb-4" />

                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        Amazing Experience
                                    </h3>

                                    <p className="text-gray-600 text-sm">
                                        Explore beautiful places and create unforgettable memories.
                                    </p>
                                </div>

                                <div className="bg-orange-50 rounded-2xl p-5">
                                    <Plane className="w-10 h-10 text-orange-600 mb-4" />

                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        Comfortable Journey
                                    </h3>

                                    <p className="text-gray-600 text-sm">
                                        Enjoy smooth and premium travel experience throughout the trip.
                                    </p>
                                </div>

                                <div className="bg-green-50 rounded-2xl p-5">
                                    <Clock className="w-10 h-10 text-green-600 mb-4" />

                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        Flexible Schedule
                                    </h3>

                                    <p className="text-gray-600 text-sm">
                                        Well planned travel itinerary for stress free exploration.
                                    </p>
                                </div>

                                <div className="bg-pink-50 rounded-2xl p-5">
                                    <MapPin className="w-10 h-10 text-pink-600 mb-4" />

                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        Best Locations
                                    </h3>

                                    <p className="text-gray-600 text-sm">
                                        Visit famous attractions and hidden gems of the destination.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div>

                        <div className="sticky top-24 bg-white rounded-3xl p-7 shadow-sm border border-gray-100">

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Trip Information
                            </h2>

                            <div className="space-y-5">

                                <div className="flex items-start gap-4">

                                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                                        <CalendarDays className="w-6 h-6 text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Departure Date
                                        </p>

                                        <h3 className="font-bold text-gray-900">
                                            {
                                                new Date(destination.startDate).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )
                                            }
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">

                                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                        <CalendarDays className="w-6 h-6 text-green-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Return Date
                                        </p>

                                        <h3 className="font-bold text-gray-900">
                                            {
                                                new Date(destination.endDate).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )
                                            }
                                        </h3>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-5">

                                    <p className="text-sm text-gray-500 mb-2">
                                        Total Package Price
                                    </p>

                                    <h2 className="text-4xl font-black text-blue-600">
                                        ₹ {destination.price?.toLocaleString()}
                                    </h2>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-4 rounded-2xl text-white font-bold text-lg shadow-lg mt-4">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleDestination;