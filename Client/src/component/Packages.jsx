import React, { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages } from "../reducer/slice/packageSlice";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Packages = () => {
    const dispatch = useDispatch();

    const { packages, loading, error } = useSelector(
        (state) => state.package
    );

    const [sortBy, setSortBy] = useState("latest");

    // =========================
    // FETCH PACKAGES
    // =========================
    useEffect(() => {
        dispatch(getPackages());
    }, [dispatch]);

    // =========================
    // SORT LOGIC
    // =========================
    const filteredPackages = useMemo(() => {
        let data = [...packages];

        if (sortBy === "price-low") data.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") data.sort((a, b) => b.price - a.price);
        if (sortBy === "latest")
            data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

        return data;
    }, [packages, sortBy]);

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* =========================
          SEO (HELMET)
      ========================= */}
            <Helmet>
                <title>Travel Packages | Best Deals & Tours</title>

                <meta
                    name="description"
                    content="Explore the best travel packages with affordable prices, exciting destinations, and premium experiences."
                />

                <meta
                    name="keywords"
                    content="travel packages, holiday packages, tour packages, trips, vacation deals"
                />

                {/* Open Graph */}
                <meta property="og:title" content="Travel Packages" />
                <meta
                    property="og:description"
                    content="Browse top travel packages and plan your next trip."
                />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* =========================
          HEADER
      ========================= */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 text-center">
                <h1 className="text-3xl md:text-5xl font-semibold mb-2">
                    Travel Packages
                </h1>
                <p className="text-purple-100">
                    Explore best trips with flights + hotels
                </p>
            </div>

            {/* =========================
          SORT
      ========================= */}
            <div className="bg-white border-b px-4 py-4 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto flex justify-end">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="latest">Latest</option>
                        <option value="price-low">Price Low → High</option>
                        <option value="price-high">Price High → Low</option>
                    </select>
                </div>
            </div>

            {/* =========================
          CONTENT
      ========================= */}
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* LOADING */}
                {loading && (
                    <p className="text-center text-gray-500">
                        Loading packages...
                    </p>
                )}

                {/* ERROR */}
                {error && (
                    <p className="text-center text-red-500">{error}</p>
                )}

                {/* COUNT */}
                {!loading && (
                    <p className="text-gray-600 mb-6">
                        Showing {filteredPackages.length} packages
                    </p>
                )}

                {/* GRID */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                        >
                            {/* IMAGE */}
                            <img
                                src={pkg.images?.[0]}
                                alt={pkg.name}
                                className="h-48 w-full object-cover"
                            />

                            {/* CONTENT */}
                            <div className="p-4 space-y-3">

                                <h3 className="text-lg font-semibold">
                                    {pkg.name}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {pkg.description}
                                </p>

                                {/* DURATION */}
                                <div className="flex items-center text-sm text-gray-600 gap-2">
                                    <Clock size={16} />
                                    {pkg.duration}
                                </div>

                                {/* PRICE */}
                                <div className="flex justify-between items-center border-t pt-3">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Starting from
                                        </p>
                                        <p className="text-xl text-blue-600 font-semibold">
                                            ₹{pkg.price}
                                        </p>
                                    </div>

                                    {/* VIEW BUTTON (SLUG BASED) */}
                                    <Link
                                        to={`/package/${pkg.seoSlug}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* EMPTY STATE */}
                {!loading && filteredPackages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            No packages found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packages;