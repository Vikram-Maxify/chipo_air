import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Plane,
  Filter,
  ChevronDown,
  TrendingDown,
  AlertCircle,
  Navigation,
  Search,
  Calendar,
  Users,
  X,
  SlidersHorizontal,
  Clock,
  DollarSign,
  Star,
  Briefcase,
  Wifi,
  Coffee,
  Luggage,
  ArrowLeftRight,
  MapPin,
  Building
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Flights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  // Search state
  const [searchParams, setSearchParams] = useState({
    from: params.get("from") || "",
    to: params.get("to") || "",
    departureDate: params.get("date") || "",
    returnDate: params.get("returnDate") || "",
    passengers: {
      adults: parseInt(params.get("adults")) || 1,
      children: parseInt(params.get("children")) || 0,
      infants: parseInt(params.get("infants")) || 0
    },
    tripType: params.get("tripType") || "oneway"
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterAirline, setFilterAirline] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState("price");
  const [departureTimeFilter, setDepartureTimeFilter] = useState("all");
  const [stopsFilter, setStopsFilter] = useState("all");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  
  const { flights, loading, error } = useSelector((state) => state.flights);
  
  // Popular cities for suggestions
  const popularCities = [
    { code: "DEL", name: "Delhi", country: "India" },
    { code: "BOM", name: "Mumbai", country: "India" },
    { code: "BLR", name: "Bangalore", country: "India" },
    { code: "MAA", name: "Chennai", country: "India" },
    { code: "CCU", name: "Kolkata", country: "India" },
    { code: "HYD", name: "Hyderabad", country: "India" },
    { code: "DXB", name: "Dubai", country: "UAE" },
    { code: "SIN", name: "Singapore", country: "Singapore" },
    { code: "LHR", name: "London", country: "UK" },
    { code: "JFK", name: "New York", country: "USA" }
  ];
  
  const [showSuggestions, setShowSuggestions] = useState({
    from: false,
    to: false
  });

  const handleBookFlight = (flight) => {
    navigate(`/flights/booking/${flight.offerId}`, {
      state: { flight, searchParams }
    });
  };
  
  const swapCities = () => {
    setSearchParams({
      ...searchParams,
      from: searchParams.to,
      to: searchParams.from
    });
  };
  
  const updatePassengers = (type, operation) => {
    setSearchParams(prev => {
      let newCount = prev.passengers[type];
      if (operation === "inc" && newCount < (type === "adults" ? 9 : 6)) {
        newCount++;
      } else if (operation === "dec" && newCount > (type === "adults" ? 1 : 0)) {
        newCount--;
      }
      
      const totalPassengers = 
        (type === "adults" ? newCount : prev.passengers.adults) +
        (type === "children" ? newCount : prev.passengers.children) +
        (type === "infants" ? newCount : prev.passengers.infants);
      
      if (totalPassengers <= 9) {
        return {
          ...prev,
          passengers: { ...prev.passengers, [type]: newCount }
        };
      }
      return prev;
    });
  };
  
  const handleSearch = () => {
    const params = new URLSearchParams({
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.departureDate,
      adults: searchParams.passengers.adults,
      children: searchParams.passengers.children,
      infants: searchParams.passengers.infants,
      tripType: searchParams.tripType
    });
    
    if (searchParams.tripType === "roundtrip" && searchParams.returnDate) {
      params.append("returnDate", searchParams.returnDate);
    }
    
    navigate(`/flights?${params.toString()}`);
    window.location.reload();
  };
  
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

  const getAirlineIcon = (airline) => {
    const airlines = {
      IndiGo: "🔵",
      "Air India": "🔴",
      SpiceJet: "🟡",
      Vistara: "🟣",
      "Go First": "⚪",
    };
    return airlines[airline] || "✈️";
  };
  
  const getAirlineFeatures = (airline) => {
    const features = {
      IndiGo: { wifi: false, meal: false, baggage: 15, entertainment: false },
      "Air India": { wifi: true, meal: true, baggage: 25, entertainment: true },
      SpiceJet: { wifi: false, meal: true, baggage: 15, entertainment: false },
      Vistara: { wifi: true, meal: true, baggage: 30, entertainment: true },
      "Go First": { wifi: false, meal: false, baggage: 15, entertainment: false }
    };
    return features[airline] || { wifi: false, meal: false, baggage: 15, entertainment: false };
  };

  const getDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  
  // Filter and sort flights
  const filteredFlights = flights.filter((f) => {
    const matchFrom = searchParams.from
      ? f.route.from.code.toLowerCase() === searchParams.from.toLowerCase() ||
        f.route.from.city.toLowerCase().includes(searchParams.from.toLowerCase())
      : true;
    
    const matchTo = searchParams.to
      ? f.route.to.code.toLowerCase() === searchParams.to.toLowerCase() ||
        f.route.to.city.toLowerCase().includes(searchParams.to.toLowerCase())
      : true;
    
    const matchAirline = filterAirline === "all" || f.airline === filterAirline;
    
    const flightPrice = parseInt(f.price?.replace(/[^0-9]/g, '') || 0);
    const matchPrice = flightPrice >= priceRange.min && flightPrice <= priceRange.max;
    
    const flightHour = new Date(f.timing.departure.scheduled).getHours();
    let matchDepartureTime = true;
    if (departureTimeFilter === "morning") matchDepartureTime = flightHour >= 0 && flightHour < 12;
    else if (departureTimeFilter === "afternoon") matchDepartureTime = flightHour >= 12 && flightHour < 17;
    else if (departureTimeFilter === "evening") matchDepartureTime = flightHour >= 17 && flightHour < 21;
    else if (departureTimeFilter === "night") matchDepartureTime = flightHour >= 21;
    
    const matchStops = stopsFilter === "all" || 
      (stopsFilter === "nonstop" && f.stops === 0) ||
      (stopsFilter === "1stop" && f.stops === 1);
    
    return matchFrom && matchTo && matchAirline && matchPrice && matchDepartureTime && matchStops;
  }).sort((a, b) => {
    const priceA = parseInt(a.price?.replace(/[^0-9]/g, '') || 0);
    const priceB = parseInt(b.price?.replace(/[^0-9]/g, '') || 0);
    const timeA = new Date(a.timing.departure.scheduled);
    const timeB = new Date(b.timing.departure.scheduled);
    const durationA = getDuration(a.timing.departure.scheduled, a.timing.arrival.scheduled);
    const durationB = getDuration(b.timing.departure.scheduled, b.timing.arrival.scheduled);
    
    if (sortBy === "price") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    if (sortBy === "time") return timeA - timeB;
    if (sortBy === "duration") return durationA.localeCompare(durationB);
    return 0;
  });
  
  const uniqueAirlines = [...new Set(flights.map((f) => f.airline))];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (flights.length > 0) {
      const prices = flights.map(f => parseInt(f.price?.replace(/[^0-9]/g, '') || 0));
      const maxPrice = Math.max(...prices, 50000);
      setPriceRange({ min: 0, max: maxPrice });
    }
  }, [flights]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Searching for the best flights...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* SEARCH BAR - MakeMyTrip Style */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pb-8">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-12">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden pb-20">
            {/* Trip Type Selector */}
            <div className="flex border-b px-6 pt-4 gap-4">
              {["oneway", "roundtrip"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchParams({ ...searchParams, tripType: type })}
                  className={`pb-3 px-2 font-medium transition-all ${
                    searchParams.tripType === type
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type === "oneway" ? "One Way" : "Round Trip"}
                </button>
              ))}
            </div>
            
            {/* Search Fields */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* From */}
                <div className="md:col-span-3 relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchParams.from}
                      onChange={(e) => {
                        setSearchParams({ ...searchParams, from: e.target.value });
                        setShowSuggestions({ ...showSuggestions, from: true });
                      }}
                      onFocus={() => setShowSuggestions({ ...showSuggestions, from: true })}
                      placeholder="City or Airport"
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {showSuggestions.from && searchParams.from && (
                      <div className="absolute top-full left-0 right-0 bg-white border rounded-xl shadow-lg mt-1 z-50 max-h-60 overflow-auto">
                        {popularCities
                          .filter(city => 
                            city.name.toLowerCase().includes(searchParams.from.toLowerCase()) ||
                            city.code.toLowerCase().includes(searchParams.from.toLowerCase())
                          )
                          .map(city => (
                            <div
                              key={city.code}
                              className="p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setSearchParams({ ...searchParams, from: city.code });
                                setShowSuggestions({ ...showSuggestions, from: false });
                              }}
                            >
                              <div className="font-medium">{city.name}</div>
                              <div className="text-xs text-gray-500">{city.code} • {city.country}</div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Swap Button */}
                <div className="flex items-center justify-center md:col-span-1">
                  <button
                    onClick={swapCities}
                    className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* To */}
                <div className="md:col-span-3 relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchParams.to}
                      onChange={(e) => {
                        setSearchParams({ ...searchParams, to: e.target.value });
                        setShowSuggestions({ ...showSuggestions, to: true });
                      }}
                      onFocus={() => setShowSuggestions({ ...showSuggestions, to: true })}
                      placeholder="City or Airport"
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {showSuggestions.to && searchParams.to && (
                      <div className="absolute top-full left-0 right-0 bg-white border rounded-xl shadow-lg mt-1 z-50 max-h-60 overflow-auto">
                        {popularCities
                          .filter(city => 
                            city.name.toLowerCase().includes(searchParams.to.toLowerCase()) ||
                            city.code.toLowerCase().includes(searchParams.to.toLowerCase())
                          )
                          .map(city => (
                            <div
                              key={city.code}
                              className="p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setSearchParams({ ...searchParams, to: city.code });
                                setShowSuggestions({ ...showSuggestions, to: false });
                              }}
                            >
                              <div className="font-medium">{city.name}</div>
                              <div className="text-xs text-gray-500">{city.code} • {city.country}</div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Departure Date */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Departure
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={searchParams.departureDate}
                      onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                
                {/* Return Date (for round trip) */}
                {searchParams.tripType === "roundtrip" && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Return
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={searchParams.returnDate}
                        onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                )}
                
                {/* Passengers */}
                <div className="md:col-span-2 relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Passengers
                  </label>
                  <button
                    onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl text-left flex items-center justify-between"
                  >
                    <span>
                      {searchParams.passengers.adults + searchParams.passengers.children + searchParams.passengers.infants} Passenger
                    </span>
                    <Users className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {showPassengerDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border rounded-xl shadow-lg mt-1 z-50 p-4">
                      {[
                        { type: "adults", label: "Adults", age: "12+ yrs", min: 1, max: 9 },
                        { type: "children", label: "Children", age: "2-12 yrs", min: 0, max: 6 },
                        { type: "infants", label: "Infants", age: "Below 2 yrs", min: 0, max: 6 }
                      ].map((item) => (
                        <div key={item.type} className="flex justify-between items-center mb-3">
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.age}</div>
                          </div>
                          <div className="flex gap-3 items-center">
                            <button
                              onClick={() => updatePassengers(item.type, "dec")}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              -
                            </button>
                            <span>{searchParams.passengers[item.type]}</span>
                            <button
                              onClick={() => updatePassengers(item.type, "inc")}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowPassengerDropdown(false)}
                        className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Search Button */}
                <div className="md:col-span-1 flex items-end">
                  <button
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sort and Filter Header */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-100 rounded-lg border-none outline-none"
            >
              <option value="price">Sort by: Price (Low to High)</option>
              <option value="price-desc">Sort by: Price (High to Low)</option>
              <option value="time">Sort by: Departure Time</option>
              <option value="duration">Sort by: Duration</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredFlights.length} flights found
          </div>
        </div>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Airlines Filter */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Airlines
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="airline"
                      value="all"
                      checked={filterAirline === "all"}
                      onChange={(e) => setFilterAirline(e.target.value)}
                    />
                    <span>All Airlines</span>
                  </label>
                  {uniqueAirlines.map(airline => (
                    <label key={airline} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="airline"
                        value={airline}
                        checked={filterAirline === airline}
                        onChange={(e) => setFilterAirline(e.target.value)}
                      />
                      <span>{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price Range
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={priceRange.max}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹0</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                </div>
              </div>
              
              {/* Departure Time */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Departure Time
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "Anytime" },
                    { value: "morning", label: "Morning (00:00 - 11:59)" },
                    { value: "afternoon", label: "Afternoon (12:00 - 16:59)" },
                    { value: "evening", label: "Evening (17:00 - 20:59)" },
                    { value: "night", label: "Night (21:00 - 23:59)" }
                  ].map(time => (
                    <label key={time.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="departureTime"
                        value={time.value}
                        checked={departureTimeFilter === time.value}
                        onChange={(e) => setDepartureTimeFilter(e.target.value)}
                      />
                      <span>{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Stops */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Stops
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Flights" },
                    { value: "nonstop", label: "Non-stop" },
                    { value: "1stop", label: "1 Stop" }
                  ].map(stop => (
                    <label key={stop.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stops"
                        value={stop.value}
                        checked={stopsFilter === stop.value}
                        onChange={(e) => setStopsFilter(e.target.value)}
                      />
                      <span>{stop.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Reset Filters */}
            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={() => {
                  setFilterAirline("all");
                  setPriceRange({ min: 0, max: 50000 });
                  setDepartureTimeFilter("all");
                  setStopsFilter("all");
                  setSortBy("price");
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* FLIGHTS LIST */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {filteredFlights.length === 0 ? (
          <div className="text-center py-20">
            <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((f, index) => {
              const duration = getDuration(f.timing.departure.scheduled, f.timing.arrival.scheduled);
              const discount = Math.floor(Math.random() * 25) + 5;
              const features = getAirlineFeatures(f.airline);
              
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                      {/* AIRLINE */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-50 p-2.5 rounded-xl">
                            <span className="text-2xl">{getAirlineIcon(f.airline)}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{f.airline}</p>
                            <p className="text-xs text-gray-500">{f.flightNumber}</p>
                            <div className="flex gap-1 mt-1">
                              {features.wifi && <Wifi className="w-3 h-3 text-green-600" />}
                              {features.meal && <Coffee className="w-3 h-3 text-orange-600" />}
                              <Briefcase className="w-3 h-3 text-gray-600" />
                              <span className="text-xs">{features.baggage}kg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* ROUTE */}
                      <div className="md:col-span-7">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-center flex-1">
                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                              {formatTime(f.timing.departure.scheduled)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(f.timing.departure.scheduled)}
                            </p>
                            <div className="mt-2">
                              <p className="font-bold text-blue-600">{f.route.from.code}</p>
                              <p className="text-xs text-gray-500">{f.route.from.city}</p>
                            </div>
                          </div>
                          
                          <div className="flex-1 px-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-2">{duration}</p>
                              <div className="relative">
                                <div className="border-t-2 border-gray-200 border-dashed"></div>
                                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 bg-white p-0.5 rotate-90" />
                              </div>
                              <p className="text-xs mt-2 text-green-600 font-medium">Direct</p>
                            </div>
                          </div>
                          
                          <div className="text-center flex-1">
                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                              {formatTime(f.timing.arrival.scheduled)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(f.timing.arrival.scheduled)}
                            </p>
                            <div className="mt-2">
                              <p className="font-bold text-blue-600">{f.route.to.code}</p>
                              <p className="text-xs text-gray-500">{f.route.to.city}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* PRICE */}
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
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">{f.price || "N/A"}</p>
                            <p className="text-xs text-gray-400">per adult</p>
                          </div>
                          <button
                            onClick={() => handleBookFlight(f)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                          >
                            Book Now
                          </button>
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
    </div>
  );
};

export default Flights;