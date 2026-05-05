import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSinglePackage } from "../reducer/slice/packageSlice";
import { Helmet } from "react-helmet-async";
import {
    Clock,
    MapPin,
    Calendar,
    Users,
    Star,
    ArrowLeft,
    Share2,
    Heart,
    Check,
    IndianRupee,
    Plane,
    Hotel,
    UtensilsCrossed,
    Camera,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const PackageDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const [activeImage, setActiveImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const { singlePackage: pkg, loading, error } = useSelector(
        (state) => state.package
    );

    useEffect(() => {
        if (slug) {
            dispatch(getSinglePackage(slug));
        }
    }, [dispatch, slug]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading package details...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load package</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => dispatch(getSinglePackage(slug))}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Not Found State
    if (!pkg) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Package not found</h2>
                    <p className="text-gray-500 mb-6">The package you're looking for doesn't exist</p>
                    <Link
                        to="/packages"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
                    >
                        Browse Packages
                    </Link>
                </div>
            </div>
        );
    }

    const features = [
        { icon: Plane, label: "Flights", value: "Included" },
        { icon: Hotel, label: "Hotel", value: "4 Star" },
        { icon: UtensilsCrossed, label: "Meals", value: "Breakfast & Dinner" },
        { icon: Camera, label: "Sightseeing", value: "Guided Tours" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* SEO */}
            <Helmet>
                <title>{pkg.metaTitle || pkg.name} | FlightBooker</title>
                <meta name="description" content={pkg.metaDescription} />
                <meta name="keywords" content={pkg.metaKeywords?.join(", ")} />
                <meta property="og:title" content={pkg.metaTitle} />
                <meta property="og:description" content={pkg.metaDescription} />
                <meta property="og:image" content={pkg.images?.[0]} />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Back Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Packages</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">

                <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">

                    {/* Left Content - Main Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                            <div className="relative">
                                <img
                                    src={pkg.images?.[activeImage] || "/api/placeholder/800/400"}
                                    alt={pkg.name}
                                    className="w-full h-64 sm:h-80 md:h-96 object-cover"
                                />

                                {/* Image Navigation */}
                                {pkg.images?.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImage(prev => prev === 0 ? pkg.images.length - 1 : prev - 1)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setActiveImage(prev => prev === pkg.images.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>

                                        {/* Dots indicator */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {pkg.images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImage(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeImage ? "bg-white w-4" : "bg-white/60"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {pkg.images?.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {pkg.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImage ? "border-blue-600" : "border-transparent opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Package Info */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {pkg.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">Multiple Destinations</span>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-lg border transition-colors ${isWishlisted
                                                ? "bg-red-50 border-red-200 text-red-500"
                                                : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                                    </button>
                                    <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{pkg.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">Min 2 Persons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-700">4.8 Rating</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Package</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {pkg.description}
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {features.map((feature, idx) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                                <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{feature.label}</p>
                                                    <p className="text-xs text-gray-500">{feature.value}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Placeholder */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((day) => (
                                    <div key={day} className="flex gap-4">
                                        <div className="text-center">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                                                {day}
                                            </div>
                                            <div className="w-px h-full bg-gray-200 mx-auto mt-2"></div>
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium text-gray-900">Day {day}</p>
                                            <p className="text-sm text-gray-600">Explore local attractions and enjoy activities</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">

                            {/* Price Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                                    <div className="flex items-baseline gap-1">
                                        <IndianRupee className="w-6 h-6 text-blue-600" />
                                        <span className="text-3xl font-bold text-gray-900">
                                            {pkg.price?.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 text-sm">/person</span>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">* Inclusive of all taxes</p>
                                </div>

                                {/* Date Picker Placeholder */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Travellers */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Travellers
                                    </label>
                                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm">
                                        <option>2 Adults</option>
                                        <option>1 Adult</option>
                                        <option>3 Adults</option>
                                        <option>4 Adults</option>
                                    </select>
                                </div>

                                {/* Book Now Button */}
                                <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                                    Book This Package
                                </button>

                                {/* Trust badges */}
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Free cancellation
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Instant confirmation
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Best price guaranteed
                                    </div>
                                </div>
                            </div>

                            {/* Need Help Card */}
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Our travel experts are here to help you plan the perfect trip
                                </p>
                                <button className="w-full bg-white text-blue-600 border-2 border-blue-600 py-2.5 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition text-sm">
                                    Contact Expert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;