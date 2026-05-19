import React, { useEffect, useState } from "react";
import { MapPin, TrendingUp, Star, ArrowRight, Search, Compass, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDestinations } from "../reducer/slice/destinationSlice";

const PopularDestinations = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { destinations, loading } = useSelector((state) => state.destination);

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllDestinations());
    }, [dispatch]);

    const filteredDestinations = destinations?.filter(
        (dest) =>
            dest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.countryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.cityName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDestinationIcon = (index) => {
        const icons = ["🏖️", "🏔️", "🏛️", "🌆", "🏝️", "🗽", "🏰", "🎭", "🌋", "🕌"];
        return icons[index % icons.length];
    };

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

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4">

                {/* HEADER */}
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

                    {/* SEARCH */}
                    <div className="relative w-full sm:w-64">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white text-sm"
                        />

                        {
                            searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            )
                        }
                    </div>
                </div>

                {/* GRID */}
                {
                    loading ? (

                        <div className="text-center py-20 text-gray-500">
                            Loading destinations...
                        </div>

                    ) : filteredDestinations?.length > 0 ? (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {filteredDestinations?.map((dest, index) => (

                                <div
                                    key={dest._id}
                                    onClick={() => navigate(`/destination/${dest._id}`)}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:-translate-y-2"
                                >

                                    {/* IMAGE */}
                                    <div className="relative h-64 overflow-hidden">

                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                        />

                                        {/* OVERLAY */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* PRICE */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">

                                            <p className="text-xs text-gray-500 font-medium">
                                                Starting From
                                            </p>

                                            <h3 className="text-lg font-bold text-blue-600">
                                                ₹ {dest.price?.toLocaleString()}
                                            </h3>
                                        </div>

                                        {/* LOCATION */}
                                        <div className="absolute bottom-4 left-4 text-white">

                                            <div className="flex items-center gap-2 mb-1">

                                                <MapPin className="w-4 h-4 text-red-400" />

                                                <p className="text-sm font-medium uppercase tracking-wide">
                                                    {dest.countryName}
                                                </p>
                                            </div>

                                            <h2 className="text-3xl font-bold capitalize">
                                                {dest.name}
                                            </h2>

                                            <p className="text-sm text-gray-200 capitalize">
                                                {dest.cityName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-5">

                                        {/* DESCRIPTION */}
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                                            {dest.description}
                                        </p>

                                        {/* DATES */}
                                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-5">

                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Departure
                                                </p>

                                                <h4 className="font-semibold text-gray-900">
                                                    {new Date(dest.startDate).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </h4>
                                            </div>

                                            <div className="w-10 border-t-2 border-dashed border-gray-300" />

                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Return
                                                </p>

                                                <h4 className="font-semibold text-gray-900">
                                                    {new Date(dest.endDate).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </h4>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-2">

                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">

                                                    <Plane className="w-5 h-5 text-blue-600" />
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Premium Trip
                                                    </p>

                                                    <h5 className="font-semibold text-gray-900">
                                                        Explore Now
                                                    </h5>
                                                </div>
                                            </div>

                                            <button className="group/btn bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">

                                                View Details

                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-all" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    ) : (

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
                    )
                }

                {/* STATS */}
                <div className="mt-12 pt-8 border-t border-gray-200">

                    <div className="grid grid-cols-3 gap-4 text-center">

                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                {destinations?.length || 0}+
                            </div>

                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Destinations
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                50+
                            </div>

                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Countries
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                4.8
                            </div>

                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Avg Rating
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularDestinations;