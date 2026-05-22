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
import PhoneSearchBar from "./PhoneSearchBar";

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
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);
  const [adults, setAdults] =
    useState(1);

  const [children, setChildren] =
    useState(0);

  const [infants, setInfants] =
    useState(0);


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
  const travellers =
    adults +
    children +
    infants;
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
  const handleSearch = () => {

    if (!from || !to) {
      alert("Please select airports");
      return;
    }

    const departureDate =
      dateRange[0]
        .startDate
        .toISOString()
        .split("T")[0];

    const returnDate =
      dateRange[0]
        .endDate
        .toISOString()
        .split("T")[0];

    navigate("/flights", {
      state: {

        from,
        to,

        fromCode:
          fromCode ||
          from
            .split("(")[1]
            ?.replace(")", ""),

        toCode:
          toCode ||
          to
            .split("(")[1]
            ?.replace(")", ""),

        departureDate,
        returnDate,

        adults:
          travellers || 1,

        children: 0,

        infants: 0,

        travelClass,

        tripType,

      },
    });

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
    <section className="relative bg-[#f5f5f5] min-h-[586px] md:min-h-[486px] overflow-visible pb-5">
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-b-[70px] md:rounded-b-[110px]" />

      {/* Desktop CONTENT */}
      <div className="relative z-[50] max-w-7xl mx-auto px-4 pt-7 overflow-visible hidden md:block">
        {/* HEADER */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-4">
            <Plane className="text-white w-4 h-4" />
            <span className="text-white text-sm font-medium">
              Best Flight Deals
            </span>
          </div>
          <h1 className="text-3xl md:text-[42px] font-bold text-white leading-tight">
            Domestic and International Flights
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 overflow-visible">

          {/* TOP */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap gap-5">
              {[
                {
                  key: "oneway",
                  label: "Oneway",
                },
                {
                  key: "roundtrip",
                  label: "Round Trip",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() =>
                    setTripType(item.key)
                  }
                  className={`flex items-center gap-2 font-semibold text-sm transition-all ${tripType === item.key
                    ? "text-blue-600"
                    : "text-gray-500"
                    }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === item.key
                    ? "border-blue-600"
                    : "border-gray-400"
                    }`}>
                    {tripType === item.key && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-gray-600 font-medium text-sm">
              Book International and Domestic Flights
            </p>
          </div>
          {/* SEARCH GRID */}
          <div className="relative border border-gray-200 rounded-[22px] bg-white z-[99999] overflow-visible">
            <div className="grid grid-cols-12 relative overflow-visible">
              {/* FROM */}
              <div className="from-wrapper col-span-3 p-4 border-r border-gray-200 relative">
                <p className="text-gray-500 text-xs mb-2">
                  From
                </p>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFrom(value);
                    setFromCode("");
                    setFromSuggestions(value.length > 1 ? searchAirports(value) : []);
                  }}
                  placeholder="Departure"
                  className="w-full text-[34px] font-bold outline-none bg-transparent text-black placeholder:text-gray-300"
                />
                {/* FROM DROPDOWN */}
                {fromSuggestions.length > 0 && (
                  <div className="absolute left-0 top-[108%] w-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.16)] z-[99999] max-h-[320px] overflow-y-auto border border-gray-200">
                    {fromSuggestions.map((airport, index) => {
                      const { city, name, code, country } = getAirportInfo(airport);
                      return (
                        <button
                          key={`${code}-${index}`}
                          onClick={() => { setFrom(`${city} (${code})`); setFromCode(code); setFromSuggestions([]); }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-black text-sm">
                                {city}
                                {country
                                  ? `, ${country}`
                                  : ""}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {name}
                              </div>
                            </div>
                            {code && (
                              <div className="bg-blue-50 text-blue-700 font-mono font-bold px-3 py-1 rounded-lg text-xs ml-3">
                                {code}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    }
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <MapPin
                    size={14}
                    className="text-gray-400"
                  />
                  <p className="text-gray-500 truncate text-xs">
                    Enter departure airport/city
                  </p>
                </div>
              </div>
              {/* SWAP */}
              <div className="absolute left-[23%] top-1/2 -translate-y-1/2 z-50">
                <button
                  onClick={swapLocations}
                  type="button"
                  className="w-10 h-10 rounded-xl shadow-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeftRight className="text-blue-600 w-4 h-4" />
                </button>
              </div>
              {/* TO */}
              <div className="to-wrapper col-span-3 p-4 pl-10 border-r border-gray-200 relative z-[9999]">
                {/* TO DROPDOWN */}
                {toSuggestions.length > 0 && (
                  <div className="absolute left-0 top-[105%] w-[115%] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-[999999] max-h-[350px] overflow-y-auto border border-gray-200">
                    {toSuggestions.map((airport, index) => {
                      const { city, name, code, country } = getAirportInfo(airport);
                      return (
                        <button
                          key={`${code}-${index}`}
                          onClick={() => { setTo(`${city} (${code})`); setToCode(code); setToSuggestions([]); }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-black text-sm">
                                {city}
                                {country
                                  ? `, ${country}`
                                  : ""}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {name}
                              </div>
                            </div>
                            {code && (
                              <div className="bg-blue-50 text-blue-700 font-mono font-bold px-3 py-1 rounded-lg text-xs ml-3">
                                {code}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    }
                    )}
                  </div>
                )}
                <p className="text-gray-500 text-xs mb-2">
                  To
                </p>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTo(value);
                    setToCode("");
                    setToSuggestions(value.length > 1 ? searchAirports(value) : []);
                  }}
                  placeholder="Destination"
                  className="w-full text-[34px] font-bold outline-none bg-transparent text-black placeholder:text-gray-300"
                />
                <div className="flex items-center gap-2 mt-2">
                  <MapPin
                    size={14}
                    className="text-gray-400"
                  />
                  <p className="text-gray-500 truncate text-xs">
                    Enter destination airport/city
                  </p>
                </div>
              </div>
              {/* DEPARTURE */}
              <div
                ref={departureRef}
                className="col-span-2 p-4 border-r border-gray-200 relative"
              >
                <button
                  onClick={() =>
                    setShowCalendar(
                      !showCalendar
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-500 text-xs">
                      Departure
                    </p>
                    <ChevronDown
                      size={14}
                      className="text-blue-600"
                    />
                  </div>
                  <div className="text-[28px] font-bold text-black">
                    {formatDate(
                      dateRange[0]
                        .startDate
                    )}
                  </div>
                </button>
              </div>
              {/* RETURN */}
              <div className="col-span-2 p-4 border-r border-gray-200 relative">
                {/* DESKTOP CALENDAR */}
                {showCalendar && (
                  <div
                    ref={calendarRef}
                    className="absolute top-[105%] left-[-320px] w-[720px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-[999999] overflow-hidden"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleDateSelect}
                      moveRangeOnFirstSelection={false}
                      retainEndDateOnFirstSelection={false}
                      ranges={dateRange}
                      months={2}
                      direction="horizontal"
                      minDate={new Date()}
                      showDateDisplay={false}
                      rangeColors={["#2563eb"]}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-500 text-xs">
                    Return
                  </p>
                </div>
                <div className="text-[28px] font-bold text-black">
                  {tripType ===
                    "oneway"
                    ? "--"
                    : formatDate(
                      dateRange[0]
                        .endDate
                    )}
                </div>
              </div>
              {/* TRAVELLERS */}
              <div className="col-span-2 p-4 relative overflow-visible">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-500 text-xs">
                    Travellers & Class
                  </p>
                </div>
                <div
                  onClick={() =>
                    setShowTravellerDropdown(
                      !showTravellerDropdown
                    )
                  }
                  className="cursor-pointer"
                >

                  <div className="flex items-start gap-3">

                    <Users
                      size={18}
                      className="text-blue-600 mt-1"
                    />

                    <div>

                      <div className="flex items-center gap-2">

                        <h2 className="text-[28px] font-bold leading-none text-gray-900">
                          {travellers}
                        </h2>

                        <span className="text-gray-500 text-sm font-medium mt-1">
                          Travellers
                        </span>

                      </div>

                      <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 font-medium mt-1">

                        <span>
                          {adults} Adult
                        </span>

                        {children > 0 && (
                          <>
                            <span className="text-gray-300">
                              •
                            </span>

                            <span>
                              {children} Child
                            </span>
                          </>
                        )}

                        {infants > 0 && (
                          <>
                            <span className="text-gray-300">
                              •
                            </span>

                            <span>
                              {infants} Infant
                            </span>
                          </>
                        )}

                      </div>

                    </div>

                  </div>

                  <p className="mt-1 text-gray-500 text-sm truncate">
                    {travelClass}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* SEARCH BUTTON */}
          <div className="flex justify-center mt-7">

            <button
              onClick={handleSearch}
              className="px-20 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-2xl font-bold shadow-2xl flex items-center justify-center gap-3 hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
            >

              <Search size={24} />

              SEARCH

            </button>

          </div>

        </div>

        {showTravellerDropdown && (

          <div className="absolute top-[76%] right-[-9rem] -translate-x-1/2 w-[340px] bg-white rounded-[26px] border border-gray-100 shadow-[0_25px_80px_rgba(0,0,0,0.12)] z-[99999] overflow-hidden">

            {/* HEADER */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-white">

              <h3 className="text-base font-bold text-gray-900">
                Travellers & Class
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Select passengers and class
              </p>

            </div>

            {/* BODY */}
            <div className="p-5 space-y-4">

              {[
                {
                  title: "Adults",
                  sub: "12+ Years",
                  value: adults,
                  setValue: setAdults,
                  min: 1,
                },

                {
                  title: "Children",
                  sub: "2-11 Years",
                  value: children,
                  setValue: setChildren,
                  min: 0,
                },

                {
                  title: "Infants",
                  sub: "Below 2 Years",
                  value: infants,
                  setValue: setInfants,
                  min: 0,
                },

              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between"
                >

                  <div>

                    <h4 className="font-semibold text-sm text-gray-900">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {item.sub}
                    </p>

                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-2 py-1.5">

                    <button
                      onClick={() =>
                        item.setValue(
                          item.value >
                            item.min
                            ? item.value - 1
                            : item.min
                        )
                      }
                      className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-base text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                      −
                    </button>

                    <span className="w-5 text-center font-bold text-sm text-gray-900">
                      {item.value}
                    </span>

                    <button
                      onClick={() =>
                        item.setValue(
                          item.value + 1
                        )
                      }
                      className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base hover:scale-105 transition-all"
                    >
                      +
                    </button>

                  </div>

                </div>

              ))}

              {/* CLASS */}
              <div className="pt-3 border-t border-gray-100">

                <h4 className="font-semibold text-sm text-gray-900 mb-3">
                  Travel Class
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Economy",
                    "Premium Economy",
                    "Business",
                    "First Class",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setTravelClass(item)
                      }
                      className={`h-10 rounded-2xl border text-xs font-semibold transition-all ${travelClass === item
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
                        }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* FOOTER */}
            <div className="p-5 pt-0">
              <button
                onClick={() =>
                  setShowTravellerDropdown(
                    false
                  )
                }
                className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* phone Serchbar */}
      <PhoneSearchBar
        tripType={tripType}
        setTripType={setTripType}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        fromCode={fromCode}
        setFromCode={setFromCode}
        toCode={toCode}
        setToCode={setToCode}
        fromSuggestions={fromSuggestions}
        setFromSuggestions={setFromSuggestions}
        toSuggestions={toSuggestions}
        setToSuggestions={setToSuggestions}
        searchAirports={searchAirports}
        getAirportInfo={getAirportInfo}
        swapLocations={swapLocations}
        departureRef={departureRef}
        calendarRef={calendarRef}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        dateRange={dateRange}
        formatDate={formatDate}
        handleDateSelect={handleDateSelect}
        isMobile={isMobile}
        travellers={travellers}
        adults={adults}
        children={children}
        infants={infants}
        showTravellerDropdown={showTravellerDropdown}
        setShowTravellerDropdown={setShowTravellerDropdown}
        setAdults={setAdults}
        setChildren={setChildren}
        setInfants={setInfants}
        travelClass={travelClass}
        setTravelClass={setTravelClass}
        handleSearch={handleSearch}
      />
    </section>
  );
};

export default Hero;