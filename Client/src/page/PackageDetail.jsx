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
    Plane,
    Hotel,
    UtensilsCrossed,
    Camera,
    ChevronLeft,
    ChevronRight,
    Car,
    Shield,
    Wifi,
    Coffee,
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
        if (slug) dispatch(getSinglePackage(slug));
    }, [dispatch, slug]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Failed to load package
                    </h2>
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

    if (!pkg) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Package not found
                    </h2>

                    <p className="text-gray-500 mb-6">
                        The package you're looking for doesn't exist
                    </p>

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
        pkg.includes?.flight && {
            icon: Plane,
            label: "Flights",
            value: "Included",
        },

        pkg.includes?.hotel && {
            icon: Hotel,
            label: "Hotel Stay",
            value: "Premium Hotels",
        },

        pkg.includes?.meal && {
            icon: UtensilsCrossed,
            label: "Meals",
            value: "Included",
        },

        pkg.includes?.sightseeing && {
            icon: Camera,
            label: "Sightseeing",
            value: "Guided Tours",
        },

        pkg.includes?.vehicle && {
            icon: Car,
            label: "Transport",
            value: "Private Vehicle",
        },

        pkg.includes?.airportTransfer && {
            icon: Plane,
            label: "Airport Transfer",
            value: "Pickup & Drop",
        },

        pkg.includes?.guide && {
            icon: Users,
            label: "Tour Guide",
            value: "Professional Guide",
        },

        pkg.includes?.insurance && {
            icon: Shield,
            label: "Insurance",
            value: "Travel Covered",
        },

        pkg.includes?.wifi && {
            icon: Wifi,
            label: "Wifi",
            value: "Free Internet",
        },

        pkg.includes?.breakfast && {
            icon: Coffee,
            label: "Breakfast",
            value: "Daily Breakfast",
        },

        pkg.includes?.lunch && {
            icon: UtensilsCrossed,
            label: "Lunch",
            value: "Included",
        },

        pkg.includes?.dinner && {
            icon: UtensilsCrossed,
            label: "Dinner",
            value: "Included",
        },
    ].filter(Boolean);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>{pkg.metaTitle || pkg.name} | FlightBooker</title>
                <meta name="description" content={pkg.metaDescription} />
                <meta
                    name="keywords"
                    content={pkg.metaKeywords?.join(", ")}
                />
            </Helmet>

            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            Back to Packages
                        </span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                            <div className="relative">
                                <img
                                    src={pkg.images?.[activeImage]}
                                    alt={pkg.name}
                                    className="w-full h-64 sm:h-80 md:h-96 object-cover"
                                />

                                {pkg.images?.length > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setActiveImage((prev) =>
                                                    prev === 0
                                                        ? pkg.images.length - 1
                                                        : prev - 1
                                                )
                                            }
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                setActiveImage((prev) =>
                                                    prev === pkg.images.length - 1
                                                        ? 0
                                                        : prev + 1
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {pkg.images?.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {pkg.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${idx === activeImage
                                                    ? "border-blue-600"
                                                    : "border-transparent"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {pkg.name}
                                    </h1>

                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{pkg.name}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            setIsWishlisted(!isWishlisted)
                                        }
                                        className={`p-2 rounded-lg border ${isWishlisted
                                                ? "bg-red-50 border-red-200 text-red-500"
                                                : "border-gray-200 text-gray-400"
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""
                                                }`}
                                        />
                                    </button>

                                    <button className="p-2 rounded-lg border border-gray-200 text-gray-400">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                        {pkg.duration}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                        {pkg.includes?.guide
                                            ? "Guided Tour"
                                            : "Self Guided"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-700">
                                        4.8 Rating
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-700">
                                        {pkg.isActive
                                            ? "Available Now"
                                            : "Unavailable"}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                    About This Package
                                </h2>

                                <p className="text-gray-600 leading-relaxed">
                                    {pkg.description}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    What's Included
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    {features.map((feature, idx) => {
                                        const Icon = feature.icon;

                                        return (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                                            >
                                                <Icon className="w-5 h-5 text-blue-600 mt-0.5" />

                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {feature.label}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {feature.value}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Starting from
                                    </p>

                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-gray-900">
                                            ${pkg.price?.toLocaleString()}
                                        </span>

                                        <span className="text-gray-500 text-sm">
                                            /person
                                        </span>
                                    </div>

                                    <p className="text-xs text-green-600 mt-1">
                                        * Inclusive of all taxes
                                    </p>
                                </div>

                                <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition">
                                    Book This Package
                                </button>

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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetail;