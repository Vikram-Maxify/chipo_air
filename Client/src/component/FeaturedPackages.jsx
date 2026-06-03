{/* components/FeaturedPackages.jsx */ }

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Clock,
    MapPin,
    Star,
    Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages } from "../reducer/slice/packageSlice";
import Banners from "./Banners";

const FeaturedPackages = () => {
    const dispatch = useDispatch();

    const packageState = useSelector(
        (state) => state.package || {}
    );

    const packages = Array.isArray(
        packageState?.packages?.packages
    )
        ? packageState.packages.packages
        : Array.isArray(packageState?.packages)
            ? packageState.packages
            : [];

    const loading = packageState?.loading;

    useEffect(() => {
        dispatch(getPackages());
    }, [dispatch]);

    const featuredPackages = packages
        .slice()
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, 4);

    const getRating = (id) => {
        const ratings = [4.2, 4.5, 4.8, 4.6, 4.9];
        return ratings[id.length % ratings.length];
    };

    return (
        <section className="pt-10 bg-gradient-to-b from-white to-[#f8fbff]">
            <div className="max-w-7xl mx-auto px-4">
                {/* HEADER - Compact */}
                <div className="flex flex-row items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                            TRENDING
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                            Popular Holiday Packages
                        </h2>
                    </div>
                    <Link to="/packages" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                        View All
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                                <div className="h-40 bg-gray-200" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="flex justify-between">
                                        <div className="h-3 bg-gray-200 rounded w-16" />
                                        <div className="h-6 bg-gray-200 rounded w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featuredPackages.map((pkg) => (
                            <div key={pkg._id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                                {/* IMAGE */}
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={pkg.images?.[0] || "/api/placeholder/500/300"}
                                        alt={pkg.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                                    {/* RATING - Small */}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow">
                                        <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-semibold text-gray-800">{getRating(pkg._id)}</span>
                                    </div>

                                    {/* LOCATION - Small */}
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                                        <MapPin size={12} />
                                        <span className="text-[10px] font-medium">Multi Dest</span>
                                    </div>
                                </div>

                                {/* CONTENT - No description, no people */}
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {pkg.name}
                                    </h3>

                                    {/* Only Duration */}
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-2">
                                        <Clock size={12} />
                                        <span>{pkg.duration}</span>
                                    </div>

                                    {/* PRICE - Less prominent */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-[9px] text-gray-400">from</span>
                                            <span className="text-sm font-semibold text-gray-700">${pkg.price?.toLocaleString()}</span>
                                        </div>
                                        <Link
                                            to={`/package/${pkg.seoSlug}`}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                                        >
                                            View
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Banners index={2} height="h-[160px]" className="py-5" />
        </section>
    );
};

export default FeaturedPackages;