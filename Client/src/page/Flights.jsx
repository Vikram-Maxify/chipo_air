import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  Plane, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Wifi,
  Coffee,
  Monitor,
  Luggage,
  Users,
  TrendingDown,
  AlertCircle,
  Calendar,
  Timer,
  Navigation
} from "lucide-react";

const Flights = () => {
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const [filterAirline, setFilterAirline] = useState("all");
  
  const { flights, loading, error } = useSelector((state) => state.flights);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      scheduled: "bg-blue-50 text-blue-700 border-blue-200",
      landed: "bg-slate-50 text-slate-700 border-slate-200",
      delayed: "bg-orange-50 text-orange-700 border-orange-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || colors.scheduled;
  };

  const getDelayText = (delay) => {
    if (!delay || delay === "On Time") return "On Time";
    if (typeof delay === "number") return `${delay} min delay`;
    return delay;
  };

  // Get airline logo/icon
  const getAirlineIcon = (airline) => {
    const airlines = {
      "IndiGo": "🔵",
      "Air India": "🔴",
      "SpiceJet": "🟡",
      "Vistara": "🟣",
      "Go First": "⚪",
    };
    return airlines[airline] || "✈️";
  };

  // Calculate flight duration
  const getDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Amenities based on airline
  const getAmenities = (airline) => {
    const amenitiesMap = {
      "IndiGo": [Wifi, Coffee, Luggage],
      "Air India": [Wifi, Monitor, Coffee, Luggage],
      "Vistara": [Wifi, Monitor, Coffee, Luggage],
    };
    return amenitiesMap[airline] || [Coffee, Luggage];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Searching for the best flights...</p>
          <p className="text-sm text-gray-400 mt-1">Comparing prices across airlines</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const uniqueAirlines = [...new Set(flights.map(f => f.airline))];
  
  const filteredFlights = flights
    .filter(f => filterAirline === "all" || f.airline === filterAirline)
    .sort((a, b) => {
      if (sortBy === "price") return (Math.floor(Math.random() * 4000) + 2500) - (Math.floor(Math.random() * 4000) + 2500);
      if (sortBy === "duration") return new Date(a.timing.arrival.scheduled) - new Date(a.timing.departure.scheduled) - (new Date(b.timing.arrival.scheduled) - new Date(b.timing.departure.scheduled));
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pb-8">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">Available Flights</h1>
              <p className="text-blue-200 text-sm mt-1">{filteredFlights.length} flights found</p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 33.3C1200 26.7 1320 13.3 1380 6.7L1440 0V80H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="relative max-w-6xl mx-auto px-4 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Airline Filter */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Airline</label>
              <div className="relative">
                <select
                  value={filterAirline}
                  onChange={(e) => setFilterAirline(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none appearance-none cursor-pointer text-sm font-medium"
                >
                  <option value="all">All Airlines</option>
                  {uniqueAirlines.map(airline => (
                    <option key={airline} value={airline}>{airline}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              </div>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none appearance-none cursor-pointer text-sm font-medium"
                >
                  <option value="price">💰 Lowest Price</option>
                  <option value="duration">⏱️ Shortest Duration</option>
                  <option value="departure">🌅 Earliest Departure</option>
                  <option value="arrival">🌙 Earliest Arrival</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              </div>
            </div>

            {/* Filter Button */}
            <div className="flex items-end">
              <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flights List */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {filteredFlights.length === 0 ? (
          <div className="text-center py-20">
            <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((f, index) => {
              const price = Math.floor(Math.random() * 4000) + 2500;
              const duration = getDuration(f.timing.departure.scheduled, f.timing.arrival.scheduled);
              const amenities = getAmenities(f.airline);
              const isExpanded = expandedFlight === index;
              const isDelayed = f.timing.departure.delay && f.timing.departure.delay !== "On Time";
              const discount = Math.floor(Math.random() * 25) + 5;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  {/* Main Card */}
                  <div className="p-4 md:p-6">
                    {/* Mobile: Airline & Price Header */}
                    <div className="flex items-center justify-between mb-4 md:hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getAirlineIcon(f.airline)}</span>
                        <div>
                          <p className="font-bold text-gray-900">{f.airline}</p>
                          <p className="text-xs text-gray-500">{f.flightNumber}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(f.status)}`}>
                        {f.status?.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                      {/* Airline Info - Desktop */}
                      <div className="hidden md:block md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-50 p-2.5 rounded-xl">
                            <span className="text-2xl">{getAirlineIcon(f.airline)}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{f.airline}</p>
                            <p className="text-xs text-gray-500">{f.flightNumber}</p>
                          </div>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="md:col-span-7">
                        <div className="flex items-center justify-between gap-2">
                          {/* Departure */}
                          <div className="text-center flex-1">
                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                              {formatTime(f.timing.departure.scheduled)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(f.timing.departure.scheduled)}
                            </p>
                            <div className="mt-2">
                              <p className="font-bold text-blue-600 text-sm md:text-base">
                                {f.route.from.code}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[80px] mx-auto">
                                {f.route.from.city}
                              </p>
                            </div>
                          </div>

                          {/* Flight Path */}
                          <div className="flex-1 px-2 md:px-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-2 font-medium">
                                {duration}
                              </p>
                              <div className="relative">
                                <div className="border-t-2 border-gray-200 border-dashed"></div>
                                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 bg-white p-0.5 transform rotate-90" />
                              </div>
                              <p className="text-xs mt-2">
                                {f.stops === 0 ? (
                                  <span className="text-green-600 font-medium flex items-center justify-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Direct
                                  </span>
                                ) : (
                                  <span className="text-orange-600 font-medium">
                                    {f.stops} stop{f.stops > 1 ? 's' : ''}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Arrival */}
                          <div className="text-center flex-1">
                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                              {formatTime(f.timing.arrival.scheduled)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(f.timing.arrival.scheduled)}
                            </p>
                            <div className="mt-2">
                              <p className="font-bold text-blue-600 text-sm md:text-base">
                                {f.route.to.code}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[80px] mx-auto">
                                {f.route.to.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="md:col-span-3">
                        <div className="flex md:flex-col items-center justify-between md:items-end gap-3">
                          <div className="text-left md:text-right">
                            {discount > 15 && (
                              <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                                <TrendingDown className="w-3 h-3" />
                                {discount}% OFF
                              </div>
                            )}
                            <p className="text-xs text-gray-500">Starting from</p>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">
                              ₹{price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">per adult</p>
                          </div>

                          <div className="flex gap-2 w-full md:w-auto">
                            <button 
                              onClick={() => setExpandedFlight(isExpanded ? null : index)}
                              className="p-2.5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 md:hidden"
                            >
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            <button className="flex-1 md:flex-initial bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(f.status)}`}>
                        {f.status?.toUpperCase()}
                      </span>
                      
                      {isDelayed && (
                        <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {getDelayText(f.timing.departure.delay)}
                        </span>
                      )}

                      <div className="hidden md:flex items-center gap-1 ml-auto">
                        {amenities.map((Icon, i) => (
                          <div key={i} className="p-1.5 bg-gray-50 rounded-lg" title="Amenity">
                            <Icon className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details - Mobile Only */}
                  <div className={`md:hidden overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 space-y-4 bg-gray-50/50">
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div>
                          <p className="text-xs text-gray-500">Terminal</p>
                          <p className="font-medium text-sm">T-{f.route.from.terminal}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Gate</p>
                          <p className="font-medium text-sm">A{f.route.from.terminal || '12'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-medium text-sm">{duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Aircraft</p>
                          <p className="font-medium text-sm">Airbus A320</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-2">Amenities</p>
                        <div className="flex gap-2">
                          {amenities.map((Icon, i) => (
                            <div key={i} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border text-xs">
                              <Icon className="w-3.5 h-3.5 text-blue-600" />
                              <span>
                                {i === 0 && "WiFi"}
                                {i === 1 && "Meal"}
                                {i === 2 && "Baggage"}
                                {i === 3 && "Entertainment"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
      `}</style>
    </div>
  );
};

export default Flights;