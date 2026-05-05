import React, { useState } from "react";
import { Calendar, Users, Search, ArrowLeftRight, Plane, MapPin, ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFlightsThunk } from "../reducer/slice/flightsSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("roundtrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  // 🔁 Swap cities
  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  // 🔍 Search handler
  const handleSearch = async () => {
    if (!from || !to) {
      alert("Please enter both departure and destination cities");
      return;
    }

    setIsLoading(true);
    try {
      const resultAction = await dispatch(
        getFlightsThunk({ from, to })
      );

      // ✅ navigate only on success
      if (getFlightsThunk.fulfilled.match(resultAction)) {
        navigate(`/flights?from=${from}&to=${to}`);
      }
    } catch (err) {
      console.log("Search error:", err);
      alert("Failed to search flights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Popular city suggestions
  const popularCities = [
    { code: "DEL", name: "New Delhi" },
    { code: "BOM", name: "Mumbai" },
    { code: "BLR", name: "Bangalore" },
    { code: "MAA", name: "Chennai" },
    { code: "CCU", name: "Kolkata" },
    { code: "HYD", name: "Hyderabad" },
  ];

  return (
    <>
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">

        {/* Heading Section */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
            <Plane className="w-4 h-4 text-blue-300" />
            <span className="text-sm text-blue-100">Discover Amazing Deals</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Your Journey
            <br />
            Starts Here
          </h1>
          
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Search hundreds of airlines to find the best flights for your next adventure. 
            Compare prices and book instantly.
          </p>
        </div>

        {/* Trip Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 inline-flex gap-1">
            <button
              onClick={() => setTripType("roundtrip")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                tripType === "roundtrip"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Round Trip
            </button>
            <button
              onClick={() => setTripType("oneway")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                tripType === "oneway"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              One Way
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
          
          <div className="flex flex-col gap-4">
            
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              
              {/* FROM */}
              <div className="lg:col-span-5 sm:col-span-1">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1 text-blue-600" />
                      From
                    </label>
                    <div className="relative">
                      <input
                        value={from}
                        onChange={(e) => setFrom(e.target.value.toUpperCase())}
                        placeholder="Enter city or airport"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                      />
                      {from && (
                        <button
                          onClick={() => setFrom("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SWAP BUTTON */}
              <div className="lg:col-span-2 flex justify-center items-end pb-1">
                <button
                  onClick={swapLocations}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:rotate-180 active:scale-95"
                >
                  <ArrowLeftRight size={20} />
                </button>
              </div>

              {/* TO */}
              <div className="lg:col-span-5 sm:col-span-1">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1 text-blue-600" />
                    To
                  </label>
                  <div className="relative">
                    <input
                      value={to}
                      onChange={(e) => setTo(e.target.value.toUpperCase())}
                      placeholder="Enter city or airport"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                    />
                    {to && (
                      <button
                        onClick={() => setTo("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row - Dates & Passengers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-4">
              
              {/* DEPARTURE */}
              <div className={`${tripType === "roundtrip" ? "col-span-1 lg:col-span-3" : "col-span-2 lg:col-span-5"}`}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1 text-blue-600" />
                  Departure
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-900"
                  />
                </div>
              </div>

              {/* RETURN */}
              {tripType === "roundtrip" && (
                <div className="col-span-1 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1 text-blue-600" />
                    Return
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-900"
                    />
                  </div>
                </div>
              )}

              {/* PASSENGERS */}
              <div className={`${tripType === "roundtrip" ? "col-span-1 lg:col-span-3" : "col-span-1 lg:col-span-4"}`}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1 text-blue-600" />
                  Passengers
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-gray-900 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className={`${tripType === "roundtrip" ? "col-span-1 lg:col-span-3" : "col-span-1 lg:col-span-3"} flex items-end`}>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                 {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Search Flights
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Popular destinations:</p>
            <div className="flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <button
                  key={city.code}
                  onClick={() => setTo(city.code)}
                  className="px-3 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-blue-300"
                >
                  {city.name} ({city.code})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-10 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
            <div className="text-xs md:text-sm text-blue-200">Airlines</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">100K+</div>
            <div className="text-xs md:text-sm text-blue-200">Routes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">1M+</div>
            <div className="text-xs md:text-sm text-blue-200">Happy Travellers</div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;