import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import {
  ArrowLeftRight,
  ChevronDown,
  MapPin,
  Plane,
  Search,
  Users,
} from "lucide-react";

import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import airportCodes from "@nwpr/airport-codes";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getFlightsThunk } from "../reducer/slice/flightsSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calendarRef = useRef();
  const departureRef = useRef();

  // Get airports data properly
  const getAllAirports = () => {
    try {
      // Check different possible data structures
      if (airportCodes.airports && Array.isArray(airportCodes.airports)) {
        return airportCodes.airports;
      }
      if (Array.isArray(airportCodes)) {
        return airportCodes;
      }
      if (airportCodes.data && Array.isArray(airportCodes.data)) {
        return airportCodes.data;
      }
      // If none of the above, try to get from default export
      return [];
    } catch (error) {
      console.error("Error loading airports:", error);
      return [];
    }
  };

  const airportsData = getAllAirports();

  const [isMobile, setIsMobile] = useState(false);

  // ================= MOBILE =================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ================= STATES =================
  const [tripType, setTripType] = useState("oneway");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [dateRange, setDateRange] = useState([
    {
      startDate: tomorrow,
      endDate: tomorrow,
      key: "selection",
    },
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [travellers, setTravellers] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");
  const [isLoading, setIsLoading] = useState(false);

  // ================= CLOSE =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        departureRef.current &&
        !departureRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }

      if (!event.target.closest(".from-wrapper")) {
        setFromSuggestions([]);
      }

      if (!event.target.closest(".to-wrapper")) {
        setToSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  // ================= SWAP LOCATIONS (FIXED) =================
  const swapLocations = () => {
    console.log("Swap clicked - Before swap:", { from, to, fromCode, toCode });
    
    // Swap the from and to values
    const tempFromValue = from;
    const tempFromCodeValue = fromCode;
    
    setFrom(to);
    setFromCode(toCode);
    
    setTo(tempFromValue);
    setToCode(tempFromCodeValue);
    
    console.log("Swap clicked - After swap:", { 
      from: to, 
      to: tempFromValue, 
      fromCode: toCode, 
      toCode: tempFromCodeValue 
    });
  };

  // ================= DATE SELECT =================
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

    setDateRange([
      {
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
        key: "selection",
      },
    ]);
  };

  // ================= AIRPORT SEARCH =================
  const searchAirports = (value) => {
    if (!value || value.length < 2) return [];
    
    const searchValue = value.toLowerCase().trim();
    
    const results = airportsData
      .filter((airport) => {
        // Handle different possible field names
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

  // ================= SEARCH =================
  const handleSearch = async () => {
    if (!from || !to) {
      alert("Please select airports");
      return;
    }

    const departureDate = dateRange[0].startDate.toISOString().split("T")[0];
    const returnDate = dateRange[0].endDate.toISOString().split("T")[0];

    try {
      setIsLoading(true);

      const resultAction = await dispatch(
        getFlightsThunk({
          from: fromCode || from.split("(")[1]?.replace(")", ""),
          to: toCode || to.split("(")[1]?.replace(")", ""),
          departure_date: departureDate,
          return_date: tripType === "roundtrip" ? returnDate : null,
          passengers: travellers,
          travelClass,
        })
      );

      if (getFlightsThunk.fulfilled.match(resultAction)) {
        navigate(
          `/flights?from=${fromCode}&to=${toCode}&departure_date=${departureDate}&return_date=${returnDate}&passengers=${travellers}`
        );
      }
    } catch (err) {
      console.log(err);
      alert("Failed to search flights");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get airport display info
  const getAirportInfo = (airport) => {
    const city = airport.city || airport.city_name || airport.municipality || "Unknown City";
    const name = airport.name || airport.airport_name || "Airport";
    const code = airport.iata || airport.code || airport.iata_code || "";
    const country = airport.country || airport.country_name || "";
    
    return { city, name, code, country };
  };

  return (
    <section className="relative bg-[#f5f5f5] min-h-[850px] md:min-h-[700px] overflow-visible">
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-b-[70px] md:rounded-b-[110px]" />

      {/* CONTENT */}
      <div className="relative z-[50] max-w-7xl mx-auto px-4 pt-10 overflow-visible pb-5">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-5">
            <Plane className="text-white w-4 h-4" />
            <span className="text-white text-sm font-medium">Best Flight Deals</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Domestic and International Flights
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-[30px] shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-4 md:p-7 overflow-visible">
          {/* TOP */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-7">
            <div className="flex flex-wrap gap-5">
              {[
                { key: "oneway", label: "Oneway" },
                { key: "roundtrip", label: "Round Trip" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTripType(item.key)}
                  className={`flex items-center gap-2 font-semibold ${
                    tripType === item.key ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      tripType === item.key ? "border-blue-600" : "border-gray-400"
                    }`}
                  >
                    {tripType === item.key && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                  {item.label}
                </button>
              ))}
            </div>

            <p className="text-gray-600 font-medium text-sm md:text-base">
              Book International and Domestic Flights
            </p>
          </div>

          {/* SEARCH GRID */}
          <div className="relative border border-gray-300 rounded-[26px] bg-white z-[999]">
            <div className="grid grid-cols-1 md:grid-cols-12 relative">
              {/* FROM */}
              <div className="from-wrapper md:col-span-3 p-5 border-b md:border-b-0 md:border-r border-gray-300 relative">
                <p className="text-gray-500 text-sm mb-2">From</p>

                <input
                  type="text"
                  value={from}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFrom(value);
                    setFromCode("");

                    if (value.length > 1) {
                      const suggestions = searchAirports(value);
                      setFromSuggestions(suggestions);
                    } else {
                      setFromSuggestions([]);
                    }
                  }}
                  placeholder="Delhi / DEL"
                  className="w-full text-3xl md:text-4xl font-bold outline-none bg-transparent text-black placeholder:text-gray-300"
                />

                {/* FROM DROPDOWN */}
                {fromSuggestions.length > 0 && (
                  <div className="absolute left-0 top-[110%] w-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-[99999] max-h-[350px] overflow-y-auto border border-gray-200">
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
                              <div className="font-semibold text-black">
                                {city}{country ? `, ${country}` : ''}
                              </div>
                              <div className="text-sm text-gray-500 mt-0.5">
                                {name}
                              </div>
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

                <div className="flex items-center gap-2 mt-2">
                  <MapPin size={16} className="text-gray-400" />
                  <p className="text-gray-500 truncate text-sm">Enter departure airport/city</p>
                </div>
              </div>

              {/* SWAP BUTTON - FIXED POSITION AND FUNCTIONALITY */}
              <div className="hidden md:flex absolute left-[22.7%] top-1/2 -translate-y-1/2 z-50">
                <button
                  onClick={swapLocations}
                  type="button"
                  className="w-12 h-12 rounded-xl shadow-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all duration-200 group"
                  aria-label="Swap locations"
                >
                  <ArrowLeftRight className="text-blue-600 w-5 h-5" />
                </button>
              </div>

              {/* TO */}
              <div className="to-wrapper md:col-span-3 p-5 md:pl-12 border-b md:border-b-0 md:border-r border-gray-300 relative z-[9999]">
                <p className="text-gray-500 text-sm mb-2">To</p>

                <input
                  type="text"
                  value={to}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTo(value);
                    setToCode("");

                    if (value.length > 1) {
                      const suggestions = searchAirports(value);
                      setToSuggestions(suggestions);
                    } else {
                      setToSuggestions([]);
                    }
                  }}
                  placeholder="Mumbai / BOM"
                  className="w-full text-3xl md:text-4xl font-bold outline-none bg-transparent text-black placeholder:text-gray-300"
                />

                {/* TO DROPDOWN */}
                {toSuggestions.length > 0 && (
                  <div className="absolute left-0 top-[110%] w-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-[99999] max-h-[350px] overflow-y-auto border border-gray-200">
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
                              <div className="font-semibold text-black">
                                {city}{country ? `, ${country}` : ''}
                              </div>
                              <div className="text-sm text-gray-500 mt-0.5">
                                {name}
                              </div>
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

                <div className="flex items-center gap-2 mt-2">
                  <MapPin size={16} className="text-gray-400" />
                  <p className="text-gray-500 truncate text-sm">Enter destination airport/city</p>
                </div>
              </div>

              {/* Mobile Swap Button */}
              <div className="md:hidden flex justify-center -my-3 relative z-40">
                <button
                  onClick={swapLocations}
                  type="button"
                  className="w-10 h-10 rounded-full shadow-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                  aria-label="Swap locations"
                >
                  <ArrowLeftRight className="text-blue-600 w-4 h-4" />
                </button>
              </div>

              {/* DEPARTURE */}
              <div ref={departureRef} className="md:col-span-2 p-5 border-b md:border-b-0 md:border-r border-gray-300 relative">
                <button onClick={() => setShowCalendar(!showCalendar)} className="w-full text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-500 text-sm">Departure</p>
                    <ChevronDown size={16} className="text-blue-600" />
                  </div>

                  <div className="text-2xl md:text-3xl font-bold text-black">
                    {formatDate(dateRange[0].startDate)}
                  </div>
                </button>

                {/* CALENDAR */}
                {showCalendar && (
                  <div
                    ref={calendarRef}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[720px] max-w-[95vw] bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-[9999]"
                  >
                    <div className="overflow-auto max-h-[80vh] p-4">
                      <DateRange
                        editableDateInputs={true}
                        onChange={handleDateSelect}
                        moveRangeOnFirstSelection={false}
                        retainEndDateOnFirstSelection={false}
                        ranges={dateRange}
                        months={isMobile ? 1 : 2}
                        direction={isMobile ? "vertical" : "horizontal"}
                        minDate={new Date()}
                        showDateDisplay={false}
                        rangeColors={["#2563eb"]}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RETURN */}
              <div className="md:col-span-2 p-5 border-b md:border-b-0 md:border-r border-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-500 text-sm">Return</p>
                </div>

                <div className="text-2xl md:text-3xl font-bold text-black">
                  {tripType === "oneway" ? "--" : formatDate(dateRange[0].endDate)}
                </div>
              </div>

              {/* TRAVELLERS */}
              <div className="md:col-span-2 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-500 text-sm">Travellers & Class</p>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(Number(e.target.value))}
                    className="text-2xl md:text-3xl font-bold bg-transparent outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="mt-2 text-gray-500 bg-transparent outline-none text-sm md:text-base"
                >
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex justify-center mt-10">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full md:w-auto px-10 md:px-24 py-4 md:py-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl md:text-3xl font-bold shadow-2xl flex items-center justify-center gap-4 hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={28} />
                  SEARCH
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;