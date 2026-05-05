import React, { useState } from "react";
import {
    MapPin,
    TrendingUp,
    Star,
    ArrowRight,
    Search,
    Compass,
    Plane
} from "lucide-react";
import { popularDestinations } from "./mockData";
import { useNavigate } from "react-router-dom";

const PopularDestinations = () => {
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter destinations based on search
    const filteredDestinations = popularDestinations.filter(
        (dest) =>
            dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get emoji based on destination type
    const getDestinationIcon = (index) => {
        const icons = ["🏖️", "🏔️", "🏛️", "🌆", "🏝️", "🗽", "🏰", "🎭", "🌋", "🕌"];
        return icons[index % icons.length];
    };

    // Get gradient based on index
    const getGradient = (index) => {
        const gradients = [
            "from-rose-500 to-pink-600",
            "from-blue-500 to-cyan-600",
            "from-emerald-500 to-teal-600",
            "from-violet-500 to-purple-600",
            "from-amber-500 to-orange-600",
            "from-sky-500 to-indigo-600",
            "from-fuchsia-500 to-pink-600",
            "from-lime-500 to-green-600",
            "from-red-500 to-rose-600",
            "from-cyan-500 to-blue-600",
        ];
        return gradients[index % gradients.length];
    };

    return (
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 overflow-hidden">

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Compass className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                Explore
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                            Popular Destinations
                            <span className="ml-2">✈️</span>
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm sm:text-base">
                            Discover the most loved travel spots around the world
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories Quick Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {["All", "Beach", "Mountain", "City", "Heritage", "Island"].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSearchTerm(category === "All" ? "" : category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${searchTerm === category || (category === "All" && !searchTerm)
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Destinations Grid */}
                {filteredDestinations.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {filteredDestinations.slice(0, 10).map((dest, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-transparent transform hover:-translate-y-2"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => navigate(`/flights?to=${dest.code}`)}
                            >
                                {/* Top gradient bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(index)} rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

                                {/* Icon Container */}
                                <div className="relative mb-3 sm:mb-4">
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        <span className="text-2xl sm:text-3xl">
                                            {getDestinationIcon(index)}
                                        </span>
                                    </div>

                                    {/* Popular badge */}
                                    {dest.popular && (
                                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg">
                                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current" />
                                        </div>
                                    )}
                                </div>

                                {/* Destination Name */}
                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                                    {dest.name}
                                </h3>

                                {/* Country */}
                                <div className="flex items-center justify-center gap-1 text-gray-500 mb-2">
                                    <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                                    <p className="text-xs sm:text-sm">{dest.country}</p>
                                </div>

                                {/* Airport Code */}
                                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                                    {dest.code}
                                </span>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 sm:pb-6">
                                    <button className="bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100">
                                        Explore
                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🌍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No destinations found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Try searching with a different keyword
                        </p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            View All Destinations
                        </button>
                    </div>
                )}

                {/* View All CTA */}
                {filteredDestinations.length > 10 && (
                    <div className="text-center mt-8">
                        <button className="group bg-white border-2 border-gray-200 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:shadow-lg">
                            View All {popularDestinations.length} Destinations
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Stats Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                {popularDestinations.length}+
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Destinations</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                50+
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Countries</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                4.8
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Avg Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularDestinations;