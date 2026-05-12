import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Plane,
  TrendingDown,
  AlertCircle,
  Navigation,
  Users,
  ArrowLeftRight,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Repeat,
  Clock8,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { DateRange } from "react-date-range";

import {
  format,
  addDays,
} from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { getFlightsThunk } from "../reducer/slice/flightsSlice";
import airportCodes from "@nwpr/airport-codes";

const Flights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Refs for click outside handling
  const fromWrapperRef = useRef(null);
  const toWrapperRef = useRef(null);
  const hasAutoFetched = useRef(false);

  // Get airports data properly
  const getAllAirports = () => {
    try {
      if (airportCodes.airports && Array.isArray(airportCodes.airports)) {
        return airportCodes.airports;
      }
      if (Array.isArray(airportCodes)) {
        return airportCodes;
      }
      if (airportCodes.data && Array.isArray(airportCodes.data)) {
        return airportCodes.data;
      }
      return [];
    } catch (error) {
      console.error("Error loading airports:", error);
      return [];
    }
  };

  const airportsData = getAllAirports();

  const params = new URLSearchParams(location.search);
  const fromQuery = params.get("from");
  const toQuery = params.get("to");
  const departureDateQuery = params.get("departure_date");

  const { flights, loading, error } = useSelector((state) => state.flights);

  // FILTER STATES
  const [filterAirline, setFilterAirline] = useState("all");
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirports, setSelectedAirports] = useState([]);
  const [maxDuration, setMaxDuration] = useState(600);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [departureTimeFilter, setDepartureTimeFilter] = useState([]);
  const [arrivalTimeFilter, setArrivalTimeFilter] = useState([]);

  // Price range from flights
  const [globalMinPrice, setGlobalMinPrice] = useState(0);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(50000);

  // SEARCH STATES
  const [tripType, setTripType] = useState("roundtrip");
  const [travelClass, setTravelClass] = useState("Economy");
  const [from, setFrom] = useState("");
  const [fromCode, setFromCode] = useState("");
  const [to, setTo] = useState("");
  const [toCode, setToCode] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [passengers, setPassengers] = useState(1);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // ================= FLIGHT DETAILS =================
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ================= AUTO FETCH DELHI TO MUMBAI FLIGHTS ON PAGE LOAD =================
  useEffect(() => {
    const fetchDelhiToMumbaiFlights = async () => {
      if (hasAutoFetched.current) return;
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = format(tomorrow, "yyyy-MM-dd");
      
      const fromAirport = fromQuery || "DEL";
      const toAirport = toQuery || "BOM";
      const travelDate = departureDateQuery || defaultDate;
      
      console.log("Auto-fetching flights:", {
        from: fromAirport,
        to: toAirport,
        date: travelDate
      });
      
      setFrom(`${fromAirport === "DEL" ? "Delhi" : fromAirport} (${fromAirport})`);
      setTo(`${toAirport === "BOM" ? "Mumbai" : toAirport} (${toAirport})`);
      setFromCode(fromAirport);
      setToCode(toAirport);
      
      setIsSearchLoading(true);
      
      try {
        const resultAction = await dispatch(
          getFlightsThunk({
            from: fromAirport,
            to: toAirport,
            departure_date: travelDate,
            return_date: null,
            passengers: 1,
            travelClass: "Economy",
          })
        );
        
        if (getFlightsThunk.fulfilled.match(resultAction)) {
          console.log("Auto-fetch successful!");
          hasAutoFetched.current = true;
          navigate(`/flights?from=${fromAirport}&to=${toAirport}&departure_date=${travelDate}`, { replace: true });
        }
      } catch (err) {
        console.log("Auto-fetch error:", err);
      } finally {
        setIsSearchLoading(false);
      }
    };
    
    fetchDelhiToMumbaiFlights();
  }, [fromQuery, toQuery, departureDateQuery, dispatch, navigate]);

  // ================= EXTRACT AIRPORT CODE =================
  const extractAirportCode = (input) => {
    if (!input) return "";
    const match = input.match(/\(([^)]+)\)/);
    if (match) {
      return match[1];
    }
    return input.trim().toUpperCase();
  };

  // ================= MANUAL SEARCH FUNCTION =================
  const handleSearch = async () => {
    if (!from || !to) {
      alert("Please enter both departure and destination cities");
      return;
    }

    const startDate = format(dateRange[0].startDate, "yyyy-MM-dd");
    const endDate = format(dateRange[0].endDate, "yyyy-MM-dd");

    setIsSearchLoading(true);

    try {
      let fromAirportCode = fromCode;
      let toAirportCode = toCode;

      if (!fromAirportCode) {
        const fromMatch = from.match(/\(([^)]+)\)/);
        fromAirportCode = fromMatch ? fromMatch[1] : from.trim().toUpperCase();
      }

      if (!toAirportCode) {
        const toMatch = to.match(/\(([^)]+)\)/);
        toAirportCode = toMatch ? toMatch[1] : to.trim().toUpperCase();
      }

      console.log("Manual search:", {
        from: fromAirportCode,
        to: toAirportCode,
        departure_date: startDate,
        return_date: tripType === "roundtrip" ? endDate : null,
        passengers,
        travelClass,
      });

      const resultAction = await dispatch(
        getFlightsThunk({
          from: fromAirportCode,
          to: toAirportCode,
          departure_date: startDate,
          return_date: tripType === "roundtrip" ? endDate : null,
          passengers,
          travelClass,
        })
      );

      if (getFlightsThunk.fulfilled.match(resultAction)) {
        navigate(`/flights?from=${fromAirportCode}&to=${toAirportCode}&departure_date=${startDate}`);
        hasAutoFetched.current = true;
      }
    } catch (err) {
      console.log("Search error:", err);
      alert("Failed to search flights.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  // ================= TRAVEL CLASS OPTIONS =================
  const travelClassOptions = ["Economy", "Premium Economy", "Business", "First Class"];

  // ================= TIME SLOTS =================
  const timeSlots = {
    morning: { label: "Early Morning (Before 6 AM)", icon: Moon, range: [0, 6], color: "bg-indigo-100 text-indigo-700" },
    sunrise: { label: "Morning (6 AM - 12 PM)", icon: Sunrise, range: [6, 12], color: "bg-orange-100 text-orange-700" },
    afternoon: { label: "Afternoon (12 PM - 6 PM)", icon: Sun, range: [12, 18], color: "bg-yellow-100 text-yellow-700" },
    evening: { label: "Evening (After 6 PM)", icon: Sunset, range: [18, 24], color: "bg-purple-100 text-purple-700" },
  };

  // ================= STOPS OPTIONS =================
  const stopsOptions = [
    { value: "nonstop", label: "Non-stop", icon: Plane },
    { value: "1stop", label: "1 Stop", icon: Repeat },
    { value: "2+stops", label: "2+ Stops", icon: Repeat },
  ];

  // ================= GET TIME OF DAY =================
  const getTimeOfDay = (datetime) => {
    const hour = new Date(datetime).getHours();
    if (hour < 6) return "morning";
    if (hour < 12) return "sunrise";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  // ================= GET STOP COUNT =================
  const getStopCount = (flight) => {
    if (flight.stops === 0 || flight.isDirect) return "nonstop";
    if (flight.stops === 1) return "1stop";
    return "2+stops";
  };

  // ================= CLICK OUTSIDE HANDLER =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromWrapperRef.current && !fromWrapperRef.current.contains(event.target)) {
        setFromSuggestions([]);
      }
      if (toWrapperRef.current && !toWrapperRef.current.contains(event.target)) {
        setToSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= UPDATE PRICE RANGE FROM FLIGHTS =================
  useEffect(() => {
    if (flights.length > 0) {
      const prices = flights.map(f => {
        const priceNum = parseInt(f.price?.replace(/[^0-9]/g, '') || '0');
        return priceNum;
      }).filter(p => p > 0);

      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setGlobalMinPrice(min);
      setGlobalMaxPrice(max);
      setPriceRange({ min, max });
    }
  }, [flights]);

  // ================= AIRPORT SEARCH FUNCTION =================
  const searchAirports = (value) => {
    if (!value || value.length < 2) return [];

    const searchValue = value.toLowerCase().trim();

    const results = airportsData
      .filter((airport) => {
        const city = (airport.city || airport.city_name || airport.municipality || "").toLowerCase();
        const name = (airport.name || airport.airport_name || "").toLowerCase();
        const code = (airport.iata || airport.code || airport.iata_code || "").toLowerCase();
        const country = (airport.country || airport.country_name || "").toLowerCase();

        return (
          city.includes(searchValue) ||
          name.includes(searchValue) ||
          code.includes(searchValue) ||
          country.includes(searchValue)
        );
      })
      .slice(0, 8);

    return results;
  };

  // Helper function to get airport display info
  const getAirportInfo = (airport) => {
    const city = airport.city || airport.city_name || airport.municipality || "Unknown City";
    const name = airport.name || airport.airport_name || "Airport";
    const code = airport.iata || airport.code || airport.iata_code || "";
    const country = airport.country || airport.country_name || "";

    return { city, name, code, country };
  };

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setShowDetailsModal(true);
  };

  // CALENDAR
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: departureDateQuery ? new Date(departureDateQuery) : addDays(new Date(), 1),
      endDate: addDays(new Date(), 3),
      key: "selection",
    },
  ]);

  const swapLocations = () => {
    const tempFrom = from;
    const tempFromCode = fromCode;

    setFrom(to);
    setFromCode(toCode);
    setTo(tempFrom);
    setToCode(tempFromCode);
  };

  const handleDateSelect = (item) => {
    const selectedRange = item.selection;

    if (tripType === "oneway") {
      setDateRange([
        {
          startDate: selectedRange.startDate,
          endDate: selectedRange.startDate,
          key: "selection",
        },
      ]);
      setShowCalendar(false);
      return;
    }

    setDateRange([selectedRange]);
  };

  const handleBookFlight = (flight) => {
    const passengerIds = flight?.passengers?.map((p) => ({
      passengerId: p.passengerId,
      type: p.type,
      passengerNo: p.passengerNo,
    })) || [];

    const availableSeats = flight?.seats || [];

    console.log("PASSENGERS:", passengerIds);
    console.log("SEATS:", availableSeats);

    navigate(`/flights/booking/${flight.offerId}`, {
      state: {
        flight,
        offerId: flight.offerId,
        passengersCount: passengers,
        passengers: passengerIds,
        availableSeats,
        seatServices: flight?.seatServices || [],
      },
    });
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getAirlineIcon = (airline) => {
    const airlines = {
      IndiGo: "🔵",
      "Air India": "🔴",
      SpiceJet: "🟡",
      Vistara: "🟣",
      "Go First": "⚪",
      "Akasa Air": "🟠",
    };
    return airlines[airline] || "✈️";
  };

  const getDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const popularCities = [
    { code: "DEL", name: "New Delhi", displayName: "New Delhi (DEL)" },
    { code: "BOM", name: "Mumbai", displayName: "Mumbai (BOM)" },
    { code: "BLR", name: "Bangalore", displayName: "Bangalore (BLR)" },
    { code: "HYD", name: "Hyderabad", displayName: "Hyderabad (HYD)" },
    { code: "CCU", name: "Kolkata", displayName: "Kolkata (CCU)" },
    { code: "MAA", name: "Chennai", displayName: "Chennai (MAA)" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const uniqueAirlines = [...new Set(flights.map((f) => f.airline))];

  // ================= FILTERED FLIGHTS =================
  const filteredFlights = flights.filter((f) => {
    const matchAirline = filterAirline === "all" || f.airline === filterAirline;
    const durationMinutes = (new Date(f.timing.arrival.scheduled) - new Date(f.timing.departure.scheduled)) / (1000 * 60);
    const matchDuration = durationMinutes <= maxDuration;
    const matchAirport = selectedAirports.length === 0 || selectedAirports.includes(f.route.to.code);
    const flightStops = getStopCount(f);
    const matchStops = selectedStops.length === 0 || selectedStops.includes(flightStops);
    const priceNum = parseInt(f.price?.replace(/[^0-9]/g, '') || '0');
    const matchPrice = priceNum >= priceRange.min && priceNum <= priceRange.max;
    const departureTimeOfDay = getTimeOfDay(f.timing.departure.scheduled);
    const matchDepartureTime = departureTimeFilter.length === 0 || departureTimeFilter.includes(departureTimeOfDay);
    const arrivalTimeOfDay = getTimeOfDay(f.timing.arrival.scheduled);
    const matchArrivalTime = arrivalTimeFilter.length === 0 || arrivalTimeFilter.includes(arrivalTimeOfDay);

    return matchAirline && matchDuration && matchAirport && matchStops && matchPrice && matchDepartureTime && matchArrivalTime;
  });

  // Clear all filters
  const clearAllFilters = () => {
    setFilterAirline("all");
    setSelectedAirports([]);
    setMaxDuration(600);
    setSelectedStops([]);
    setDepartureTimeFilter([]);
    setArrivalTimeFilter([]);
    setPriceRange({ min: globalMinPrice, max: globalMaxPrice });
  };

  if (loading || isSearchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-700 font-semibold text-lg">Searching Flights...</p>
          <p className="text-sm text-gray-500 mt-1">Finding best deals for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEARCH SECTION */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pb-10">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          {/* TRIP TYPE */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 rounded-xl p-1 flex gap-2">
              <button
                onClick={() => setTripType("roundtrip")}
                className={`px-5 py-2 rounded-lg font-semibold ${tripType === "roundtrip" ? "bg-white text-black" : "text-white"}`}
              >
                Round Trip
              </button>
              <button
                onClick={() => setTripType("oneway")}
                className={`px-5 py-2 rounded-lg font-semibold ${tripType === "oneway" ? "bg-white text-black" : "text-white"}`}
              >
                One Way
              </button>
            </div>
          </div>

          {/* SEARCH BOX */}
          <div className="bg-white/95 border border-blue-100 rounded-[32px] p-4 md:p-5 shadow-[0_20px_80px_rgba(37,99,235,0.12)] overflow-visible">
            {/* TOP BAR */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "oneway", label: "One Way" },
                  { key: "roundtrip", label: "Round Trip" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTripType(item.key)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      tripType === item.key
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Plane size={16} />
                <span>Compare prices from 500+ airlines</span>
              </div>
            </div>

            {/* SEARCH FIELDS */}
            <div className="relative flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-3">
              {/* FROM FIELD */}
              <div className="flex-1 min-w-[180px] relative" ref={fromWrapperRef}>
                <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wide">From</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                  <input
                    value={from}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFrom(value);
                      setFromCode("");
                      if (value.length > 1) {
                        setFromSuggestions(searchAirports(value));
                      } else {
                        setFromSuggestions([]);
                      }
                    }}
                    placeholder="Delhi (DEL)"
                    className="w-full h-[64px] border border-gray-200 bg-white rounded-2xl pl-12 pr-4 text-lg font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
                {fromSuggestions.length > 0 && (
                  <div className="absolute left-0 top-[100%] mt-2 w-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-[99999] max-h-[350px] overflow-y-auto border border-gray-200">
                    {fromSuggestions.map((airport, index) => {
                      const { city, name, code, country } = getAirportInfo(airport);
                      return (
                        <button
                          key={`${code}-${index}`}
                          onClick={() => {
                            setFrom(`${city} (${code})`);
                            setFromCode(code);
                            setFromSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-black">{city}{country ? `, ${country}` : ''}</div>
                              <div className="text-sm text-gray-500 mt-0.5">{name}</div>
                            </div>
                            {code && (
                              <div className="bg-blue-50 text-blue-700 font-mono font-bold px-3 py-1.5 rounded-lg text-sm ml-3">
                                {code}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SWAP BUTTON */}
              <div className="hidden xl:flex items-center justify-center pt-6">
                <button
                  onClick={swapLocations}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg"
                >
                  <ArrowLeftRight size={20} />
                </button>
              </div>

              {/* TO FIELD */}
              <div className="flex-1 min-w-[180px] relative" ref={toWrapperRef}>
                <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wide">To</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                  <input
                    value={to}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTo(value);
                      setToCode("");
                      if (value.length > 1) {
                        setToSuggestions(searchAirports(value));
                      } else {
                        setToSuggestions([]);
                      }
                    }}
                    placeholder="Mumbai (BOM)"
                    className="w-full h-[64px] border border-gray-200 bg-white rounded-2xl pl-12 pr-4 text-lg font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
                {toSuggestions.length > 0 && (
                  <div className="absolute left-0 top-[100%] mt-2 w-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-[99999] max-h-[350px] overflow-y-auto border border-gray-200">
                    {toSuggestions.map((airport, index) => {
                      const { city, name, code, country } = getAirportInfo(airport);
                      return (
                        <button
                          key={`${code}-${index}`}
                          onClick={() => {
                            setTo(`${city} (${code})`);
                            setToCode(code);
                            setToSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-black">{city}{country ? `, ${country}` : ''}</div>
                              <div className="text-sm text-gray-500 mt-0.5">{name}</div>
                            </div>
                            {code && (
                              <div className="bg-blue-50 text-blue-700 font-mono font-bold px-3 py-1.5 rounded-lg text-sm ml-3">
                                {code}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MOBILE SWAP */}
              <div className="flex xl:hidden justify-center">
                <button onClick={swapLocations} className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                  <ArrowLeftRight size={18} />
                </button>
              </div>

              {/* DATE PICKER */}
              <div className="flex-[1.3] min-w-[260px] relative">
                <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wide">Travel Dates</label>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full h-[64px] border border-gray-200 rounded-2xl px-4 bg-white hover:border-blue-500 hover:ring-4 hover:ring-blue-100 transition-all text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Departure</p>
                      <p className="font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">
                        {format(dateRange[0].startDate, "dd MMM yyyy")}
                      </p>
                    </div>
                    {tripType === "roundtrip" && <div className="h-9 w-px bg-gray-200"></div>}
                    {tripType === "roundtrip" && (
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase">Return</p>
                        <p className="font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">
                          {format(dateRange[0].endDate, "dd MMM yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                </button>

                {showCalendar && (
                  <>
                    <div className="fixed inset-0 z-[9998] bg-black/40" onClick={() => setShowCalendar(false)} />
                    <div className="fixed xl:absolute left-1/2 xl:left-auto xl:right-0 bottom-0 xl:bottom-auto xl:top-[110%] -translate-x-1/2 xl:translate-x-0 z-[9999] w-[100vw] xl:w-auto bg-white rounded-t-[32px] xl:rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.18)] overflow-hidden border border-gray-200">
                      <div className="xl:hidden flex items-center justify-between px-5 py-4 border-b">
                        <h3 className="font-bold text-lg">Select Dates</h3>
                        <button onClick={() => setShowCalendar(false)} className="w-9 h-9 rounded-full bg-gray-100">✕</button>
                      </div>
                      <div className="overflow-auto max-h-[80vh] p-2 md:p-4">
                        <DateRange
                          editableDateInputs={true}
                          onChange={handleDateSelect}
                          moveRangeOnFirstSelection={false}
                          retainEndDateOnFirstSelection={false}
                          ranges={dateRange}
                          months={window.innerWidth < 768 ? 1 : 2}
                          direction={window.innerWidth < 768 ? "vertical" : "horizontal"}
                          minDate={addDays(new Date(), 1)}
                          rangeColors={["#2563eb"]}
                        />
                      </div>
                      <div className="p-4 border-t flex justify-end">
                        <button
                          onClick={() => setShowCalendar(false)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* TRAVELLERS & CLASS */}
              <div className="w-full xl:w-[280px]">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wide">Travellers</label>
                    <div className="relative">
                      <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full h-[64px] border border-gray-200 rounded-2xl pl-12 pr-4 bg-white text-lg font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n}>{n} {n === 1 ? "Traveller" : "Travellers"}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wide">Class</label>
                    <div className="relative">
                      <Plane size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                      <select
                        value={travelClass}
                        onChange={(e) => setTravelClass(e.target.value)}
                        className="w-full h-[64px] border border-gray-200 rounded-2xl pl-12 pr-4 bg-white text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                      >
                        {travelClassOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="w-full xl:w-[90px] pt-0 xl:pt-6">
                <button
                  onClick={handleSearch}
                  disabled={isSearchLoading}
                  className="w-full h-[64px] rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-xl disabled:opacity-50"
                >
                  {isSearchLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search size={24} />
                  )}
                </button>
              </div>
            </div>

            {/* POPULAR CITIES */}
            <div className="flex flex-wrap gap-2 pt-5">
              {popularCities.map((city) => (
                <button
                  key={city.code}
                  onClick={() => {
                    setTo(city.displayName);
                    setToCode(city.code);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium transition-all"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WITH FILTERS */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR FILTERS */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-5 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="flex justify-between items-center mb-5 pb-3 border-b">
                <h2 className="font-bold text-xl">Filters</h2>
                <button onClick={clearAllFilters} className="text-blue-600 text-sm hover:text-blue-800 font-semibold">Clear All</button>
              </div>

              {/* AIRLINE FILTER */}
              {uniqueAirlines.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Plane size={18} className="text-blue-600" />
                    Airlines
                  </h3>
                  <select
                    value={filterAirline}
                    onChange={(e) => setFilterAirline(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Airlines</option>
                    {uniqueAirlines.map((airline) => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* STOPS FILTER */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Repeat size={18} className="text-blue-600" />
                  Stops
                </h3>
                <div className="space-y-2">
                  {stopsOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedStops.includes(option.value)}
                          onChange={() => {
                            if (selectedStops.includes(option.value)) {
                              setSelectedStops(selectedStops.filter((s) => s !== option.value));
                            } else {
                              setSelectedStops([...selectedStops, option.value]);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <Icon size={16} className="text-gray-500" />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* DEPARTURE TIME FILTER */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock8 size={18} className="text-blue-600" />
                  Departure Time
                </h3>
                <div className="space-y-2">
                  {Object.entries(timeSlots).map(([key, slot]) => {
                    const Icon = slot.icon;
                    return (
                      <label key={key} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={departureTimeFilter.includes(key)}
                          onChange={() => {
                            if (departureTimeFilter.includes(key)) {
                              setDepartureTimeFilter(departureTimeFilter.filter((t) => t !== key));
                            } else {
                              setDepartureTimeFilter([...departureTimeFilter, key]);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <Icon size={16} className="text-gray-500" />
                        <span className="text-sm">{slot.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* ARRIVAL TIME FILTER */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Arrival Time
                </h3>
                <div className="space-y-2">
                  {Object.entries(timeSlots).map(([key, slot]) => {
                    const Icon = slot.icon;
                    return (
                      <label key={key} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={arrivalTimeFilter.includes(key)}
                          onChange={() => {
                            if (arrivalTimeFilter.includes(key)) {
                              setArrivalTimeFilter(arrivalTimeFilter.filter((t) => t !== key));
                            } else {
                              setArrivalTimeFilter([...arrivalTimeFilter, key]);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <Icon size={16} className="text-gray-500" />
                        <span className="text-sm">{slot.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* PRICE RANGE FILTER */}
              {flights.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign size={18} className="text-blue-600" />
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={globalMinPrice}
                      max={globalMaxPrice}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">₹{priceRange.min.toLocaleString()}</span>
                      <span className="text-gray-600">₹{priceRange.max.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DURATION FILTER */}
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    Duration
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {Math.floor(maxDuration / 60)}h {maxDuration % 60}m
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="600"
                  step="30"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* AIRPORTS FILTER */}
              {flights.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-600" />
                    Destination Airports
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[...new Set(flights.map((f) => f.route.to.code))].map((airport) => (
                      <label key={airport} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedAirports.includes(airport)}
                          onChange={() => {
                            if (selectedAirports.includes(airport)) {
                              setSelectedAirports(selectedAirports.filter((a) => a !== airport));
                            } else {
                              setSelectedAirports([...selectedAirports, airport]);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{airport}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FLIGHTS LIST */}
          <div className="lg:col-span-9">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Found <span className="font-bold text-blue-600">{filteredFlights.length}</span> flights
              </p>
              <p className="text-sm text-gray-500">
                {fromCode === "DEL" && toCode === "BOM" ? "Showing Delhi to Mumbai flights" : "Showing search results"}
              </p>
            </div>

            {filteredFlights.length === 0 && flights.length === 0 && !loading && !isSearchLoading ? (
              <div className="bg-white rounded-3xl p-10 text-center">
                <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Flights Found</h2>
                <p className="text-gray-500">Please search for flights to see results</p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Search Flights
                </button>
              </div>
            ) : filteredFlights.length === 0 && flights.length > 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center">
                <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Flights Match</h2>
                <p className="text-gray-500">Try adjusting your filters to see more options</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredFlights.map((f, index) => {
                  const duration = getDuration(f.timing.departure.scheduled, f.timing.arrival.scheduled);
                  const discount = Math.floor(Math.random() * 25) + 5;
                  const departureTimeOfDay = getTimeOfDay(f.timing.departure.scheduled);
                  const arrivalTimeOfDay = getTimeOfDay(f.timing.arrival.scheduled);
                  const DepartureIcon = timeSlots[departureTimeOfDay]?.icon || Clock;
                  const ArrivalIcon = timeSlots[arrivalTimeOfDay]?.icon || Clock;

                  return (
                    <div key={f.offerId || index} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                          {/* AIRLINE */}
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-3 rounded-xl">
                                <span className="text-2xl">{getAirlineIcon(f.airline)}</span>
                              </div>
                              <div>
                                <p className="font-bold">{f.airline}</p>
                                <p className="text-xs text-gray-500">{f.flightNumber}</p>
                              </div>
                            </div>
                          </div>

                          {/* ROUTE */}
                          <div className="md:col-span-7">
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <p className="text-2xl font-bold">{formatTime(f.timing.departure.scheduled)}</p>
                                <p className="text-sm text-gray-500">{f.route.from.code}</p>
                                <div className="flex items-center gap-1 mt-1 justify-center">
                                  <DepartureIcon size={12} className={timeSlots[departureTimeOfDay]?.color.split(' ')[1] || "text-gray-500"} />
                                  <span className="text-xs text-gray-400">{timeSlots[departureTimeOfDay]?.label.split(' ')[0]}</span>
                                </div>
                              </div>
                              <div className="flex-1 px-5 text-center">
                                <p className="text-sm text-gray-500 mb-2">{duration}</p>
                                <div className="relative">
                                  <div className="border-t-2 border-dashed border-gray-300"></div>
                                  <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 rotate-90 w-5 h-5" />
                                </div>
                                <p className="text-xs text-green-600 mt-2 font-semibold">
                                  {f.stops === 0 ? "Direct" : f.stops === 1 ? "1 Stop" : `${f.stops} Stops`}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold">{formatTime(f.timing.arrival.scheduled)}</p>
                                <p className="text-sm text-gray-500">{f.route.to.code}</p>
                                <div className="flex items-center gap-1 mt-1 justify-center">
                                  <ArrivalIcon size={12} className={timeSlots[arrivalTimeOfDay]?.color.split(' ')[1] || "text-gray-500"} />
                                  <span className="text-xs text-gray-400">{timeSlots[arrivalTimeOfDay]?.label.split(' ')[0]}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* PRICE */}
                          <div className="md:col-span-3 text-right">
                            {discount > 15 && (
                              <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold mb-2">
                                <TrendingDown className="w-3 h-3" />
                                {discount}% OFF
                              </div>
                            )}
                            <p className="text-3xl font-bold">{f.price || "N/A"}</p>
                            <p className="text-xs text-gray-400 mb-4">per adult</p>
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              <button
                                onClick={() => handleViewDetails(f)}
                                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-300"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleBookFlight(f)}
                                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03]"
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
      </div>

      {/* FLIGHT DETAILS MODAL */}
      {showDetailsModal && selectedFlight && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setShowDetailsModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[95vw] max-w-2xl bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.16)] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedFlight.airline}</h2>
                <p className="text-sm text-gray-500 mt-1">Flight No: {selectedFlight.flightNumber}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="w-9 h-9 rounded-full hover:bg-gray-100 transition-all text-xl flex items-center justify-center">✕</button>
            </div>
            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="max-w-[150px]">
                  <p className="text-3xl font-bold text-gray-900">{selectedFlight?.route?.from?.code}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{selectedFlight?.route?.from?.city}</p>
                  {selectedFlight?.route?.from?.airport && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{selectedFlight?.route?.from?.airport}</p>
                  )}
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full border-t border-dashed border-gray-300 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-lg">✈️</div>
                  </div>
                  <span className="text-xs text-gray-400 mt-3 capitalize">{selectedFlight.status}</span>
                </div>
                <div className="text-right max-w-[150px] ml-auto">
                  <p className="text-3xl font-bold text-gray-900">{selectedFlight?.route?.to?.code}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{selectedFlight?.route?.to?.city}</p>
                  {selectedFlight?.route?.to?.airport && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{selectedFlight?.route?.to?.airport}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Departure</p>
                  <p className="font-semibold text-gray-900 break-words">{selectedFlight?.timing?.departure?.scheduled}</p>
                  <p className="text-sm text-green-600 mt-2 font-medium">{selectedFlight?.timing?.departure?.delay || "On Time"}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Arrival</p>
                  <p className="font-semibold text-gray-900 break-words">{selectedFlight?.timing?.arrival?.scheduled}</p>
                  <p className="text-sm text-green-600 mt-2 font-medium">{selectedFlight?.timing?.arrival?.delay || "On Time"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Terminal</p>
                  <p className="font-semibold text-gray-900">{selectedFlight?.route?.from?.terminal || "N/A"}</p>
                </div>
                <div className="border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Gate</p>
                  <p className="font-semibold text-gray-900">{selectedFlight?.route?.from?.gate || "N/A"}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm opacity-80">Ticket Price</p>
                  <h2 className="text-3xl font-bold mt-1">{selectedFlight.price}</h2>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleBookFlight(selectedFlight);
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:scale-105 transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Flights;