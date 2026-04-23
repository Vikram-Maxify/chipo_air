import React, { useState, useMemo } from "react";
import { Star, MapPin, Clock } from "lucide-react";
import { mockPackages } from "./mockData";

const Packages = () => {
    const [sortBy, setSortBy] = useState("popular");
    const [selectedRegion, setSelectedRegion] = useState("all");

    const filteredPackages = useMemo(() => {
        let data = [...mockPackages];

        if (selectedRegion === "domestic") {
            data = data.filter((p) => p.destination.includes("India"));
        } else if (selectedRegion === "international") {
            data = data.filter((p) => !p.destination.includes("India"));
        }

        if (sortBy === "price-low") data.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") data.sort((a, b) => b.price - a.price);
        if (sortBy === "rating") data.sort((a, b) => b.rating - a.rating);
        if (sortBy === "popular") data.sort((a, b) => b.reviews - a.reviews);

        return data;
    }, [sortBy, selectedRegion]);

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 text-center">
                <h1 className="text-3xl md:text-5xl font-semibold mb-2">
                    Travel Packages
                </h1>
                <p className="text-purple-100">
                    Explore best trips with flights + hotels
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border-b sticky top-16 z-40 px-4 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">

                    {/* Region Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {["all", "domestic", "international"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setSelectedRegion(r)}
                                className={`px-4 py-2 rounded-full text-sm ${selectedRegion === r
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100"
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="popular">Most Popular</option>
                        <option value="price-low">Price Low → High</option>
                        <option value="price-high">Price High → Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">

                <p className="text-gray-600 mb-6">
                    Showing {filteredPackages.length} packages
                </p>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                        >
                            {/* Image */}
                            <img
                                src={pkg.image}
                                alt={pkg.title}
                                className="h-48 w-full object-cover"
                            />

                            {/* Content */}
                            <div className="p-4 space-y-3">

                                <h3 className="text-lg font-semibold">
                                    {pkg.title}
                                </h3>

                                <div className="flex items-center text-sm text-gray-600 gap-2">
                                    <MapPin size={16} />
                                    {pkg.destination}
                                </div>

                                <div className="flex items-center text-sm text-gray-600 gap-2">
                                    <Clock size={16} />
                                    {pkg.duration}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                                    {pkg.rating} ({pkg.reviews})
                                </div>

                                {/* Price */}
                                <div className="flex justify-between items-center border-t pt-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Starting from</p>
                                        <p className="text-xl text-blue-600 font-semibold">
                                            ₹{pkg.price}
                                        </p>
                                    </div>

                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Empty State */}
                {filteredPackages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No packages found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packages;