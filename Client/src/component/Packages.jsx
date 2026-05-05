import React, { useEffect, useMemo, useState } from "react";
import { 
  Clock, 
  MapPin, 
  Star, 
  TrendingUp, 
  Filter, 
  Search,
  ChevronDown,
  Sparkles,
  Plane,
  Calendar,
  Users,
  ArrowRight,
  Tag
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages } from "../reducer/slice/packageSlice";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Packages = () => {
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector((state) => state.package);

  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch packages
  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  // Sort and filter logic
  const filteredPackages = useMemo(() => {
    let data = [...packages];

    // Search filter
    if (searchTerm) {
      data = data.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        data.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        data.sort((a, b) => (b.bookings || 0) - (a.bookings || 0));
        break;
      case "duration":
        data.sort((a, b) => {
          const getDays = (duration) => parseInt(duration) || 0;
          return getDays(a.duration) - getDays(b.duration);
        });
        break;
      default: // latest
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [packages, sortBy, searchTerm]);

  // Get random star rating for demo (replace with real data)
  const getRating = (id) => {
    const ratings = [4.2, 4.5, 4.8, 4.0, 4.6, 3.9, 4.7, 4.3];
    return ratings[id.length % ratings.length];
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* SEO */}
      <Helmet>
        <title>Travel Packages | Best Deals & Tours 2024</title>
        <meta
          name="description"
          content="Explore the best travel packages with affordable prices, exciting destinations, and premium experiences. Book your dream vacation today."
        />
        <meta
          name="keywords"
          content="travel packages, holiday packages, tour packages, trips, vacation deals, cheap travel"
        />
        <meta property="og:title" content="Travel Packages | Best Deals & Tours" />
        <meta
          property="og:description"
          content="Browse top travel packages and plan your next trip with exclusive deals."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm text-blue-100">Exclusive Travel Deals</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Explore Amazing
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Travel Packages
              </span>
            </h1>
            
            <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto mb-8">
              Discover handpicked travel experiences with flights, hotels, and
              activities bundled at unbeatable prices
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{packages.length}+</div>
                <div className="text-xs md:text-sm text-blue-200">Packages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
                <div className="text-xs md:text-sm text-blue-200">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">10K+</div>
                <div className="text-xs md:text-sm text-blue-200">Happy Travellers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 60C840 70 960 80 1080 75C1200 70 1320 50 1380 40L1440 30V120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages by name or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex gap-3 items-center w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-48 pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none cursor-pointer bg-white"
                >
                  <option value="latest">🕒 Latest</option>
                  <option value="popular">⭐ Most Popular</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                  <option value="duration">📅 Duration</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 w-6 h-6 animate-pulse" />
            </div>
            <p className="mt-4 text-gray-500 font-medium">
              Finding the best packages for you...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-red-500 text-lg font-medium mb-2">
              Oops! Something went wrong
            </div>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(getPackages())}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {filteredPackages.length}
              </span>{" "}
              {filteredPackages.length === 1 ? "package" : "packages"} found
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Packages Grid */}
        {!loading && !error && filteredPackages.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={pkg.images?.[0] || "/api/placeholder/400/300"}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Tag size={12} />
                      Best Seller
                    </span>
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    {getRating(pkg._id)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                    <MapPin size={14} />
                    <span>Multiple Destinations</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {pkg.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {pkg.description}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>2 Persons</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{pkg.price?.toLocaleString()}
                        <span className="text-sm text-gray-400 font-normal">
                          /person
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/package/${pkg.seoSlug}`}
                      className="group/btn bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                      View Deal
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPackages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No packages found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("latest");
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Packages;