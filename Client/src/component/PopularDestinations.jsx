import React from "react";
import { popularDestinations } from "./mockData";

const PopularDestinations = () => {
    return (
        <section className="bg-gray-50 py-12">

            <div className="max-w-7xl mx-auto px-4">

                {/* Heading */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        Popular Destinations ✈️
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                    {popularDestinations.slice(0, 10).map((dest, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-4 text-center shadow hover:shadow-lg transition cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="text-3xl mb-2">🌍</div>

                            {/* Name */}
                            <h3 className="font-medium">
                                {dest.name}
                            </h3>

                            {/* Country */}
                            <p className="text-sm text-gray-500">
                                {dest.country}
                            </p>

                            {/* Code */}
                            <p className="text-xs text-blue-600 mt-1">
                                {dest.code}
                            </p>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default PopularDestinations;