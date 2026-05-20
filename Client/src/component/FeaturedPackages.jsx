/* components/FeaturedPackages.jsx */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Star, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages } from "../reducer/slice/packageSlice";

const FeaturedPackages = () => {
    const dispatch = useDispatch();

    const { packages = [], loading } = useSelector(
        (state) => state.package
    );

    useEffect(() => {
        dispatch(getPackages());
    }, [dispatch]);

    const featuredPackages = [...packages]
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, 3);

    const getRating = (id) => {
        const ratings = [4.2, 4.5, 4.8, 4.6, 4.9];
        return ratings[id.length % ratings.length];
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                    <div>
                        <span className="inline-flex px-5 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                            TRENDING PACKAGES
                        </span>

                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-5 leading-tight">
                            Explore Our Best <br />
                            Travel Packages
                        </h2>
                    </div>

                    <Link
                        to="/packages"
                        className="group inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-all"
                    >
                        View All Packages

                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse"
                            >
                                <div className="h-56 bg-gray-200" />

                                <div className="p-6">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-4" />

                                    <div className="h-6 bg-gray-200 rounded w-full mb-3" />

                                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />

                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />

                                    <div className="flex justify-between">
                                        <div className="h-10 bg-gray-200 rounded w-24" />

                                        <div className="h-10 bg-gray-200 rounded w-28" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {featuredPackages.map((pkg) => (
                            <div
                                key={pkg._id}
                                className="group bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* IMAGE */}
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={
                                            pkg.images?.[0] ||
                                            "/api/placeholder/500/300"
                                        }
                                        alt={pkg.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                    {/* RATING */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />

                                        <span className="text-sm font-bold text-gray-900">
                                            {getRating(pkg._id)}
                                        </span>
                                    </div>

                                    {/* LOCATION */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                                        <MapPin size={16} />

                                        <span className="text-sm font-medium">
                                            Multiple Destinations
                                        </span>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-all">
                                        {pkg.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-7 line-clamp-3 mb-5">
                                        {pkg.description}
                                    </p>

                                    {/* INFO */}
                                    <div className="flex items-center gap-5 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />

                                            <span>{pkg.duration}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Users size={16} />

                                            <span>2 Persons</span>
                                        </div>
                                    </div>

                                    {/* PRICE + BUTTON */}
                                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Starting From
                                            </p>

                                            <h4 className="text-3xl font-black text-purple-600">
                                                $ {pkg.price?.toLocaleString()}
                                                <h4 className="text-3xl font-black text-purple-600">
                                                </h4>
                                            </h4>
                                        </div>

                                        <Link
                                            to={`/package/${pkg.seoSlug}`}
                                            className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            View Deal

                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-all" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedPackages;