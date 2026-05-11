import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Plane,
  Filter,
  ChevronDown,
  TrendingDown,
  AlertCircle,
  Navigation,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const Flights = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const params = new URLSearchParams(
    location.search
  );

  const fromQuery = params.get("from");

  const toQuery = params.get("to");

  const [filterAirline, setFilterAirline] =
    useState("all");

  const { flights, loading, error } =
    useSelector((state) => state.flights);

// ✅ HANDLE BOOK
const handleBookFlight = (flight) => {
  navigate(
    `/flights/booking/${flight.offerId}`,
    {
      state: {
        flight,
      },
    }
  );
};



  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }
    );

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

  const getDuration = (
    departure,
    arrival
  ) => {
    const diff =
      new Date(arrival) -
      new Date(departure);

    const hours = Math.floor(
      diff / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (diff % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8 animate-pulse" />
          </div>

          <p className="mt-4 text-gray-600 font-medium">
            Searching for the best
            flights...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>

          <p className="text-gray-500 mb-6">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const uniqueAirlines = [
    ...new Set(
      flights.map((f) => f.airline)
    ),
  ];

  const filteredFlights = flights.filter(
    (f) => {
      const matchFrom = fromQuery
        ? f.route.from.code.toLowerCase() ===
          fromQuery.toLowerCase()
        : true;

      const matchTo = toQuery
        ? f.route.to.code.toLowerCase() ===
          toQuery.toLowerCase()
        : true;

      const matchAirline =
        filterAirline === "all" ||
        f.airline === filterAirline;

      return (
        matchFrom &&
        matchTo &&
        matchAirline
      );
    }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* HERO */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pb-8">
        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
              <Plane className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                Available Flights
              </h1>

              <p className="text-blue-200 text-sm mt-1">
                {filteredFlights.length} flights
                found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="relative max-w-6xl mx-auto px-4 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Airline
              </label>

              <div className="relative">
                <select
                  value={filterAirline}
                  onChange={(e) =>
                    setFilterAirline(
                      e.target.value
                    )
                  }
                  className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none appearance-none cursor-pointer text-sm font-medium"
                >
                  <option value="all">
                    All Airlines
                  </option>

                  {uniqueAirlines.map(
                    (airline) => (
                      <option
                        key={airline}
                        value={airline}
                      >
                        {airline}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLIGHTS */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {filteredFlights.length === 0 ? (
          <div className="text-center py-20">
            <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No flights found
            </h3>

            <p className="text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map(
              (f, index) => {
                const duration =
                  getDuration(
                    f.timing.departure
                      .scheduled,
                    f.timing.arrival
                      .scheduled
                  );

                const discount =
                  Math.floor(
                    Math.random() * 25
                  ) + 5;

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
                              <span className="text-2xl">
                                {getAirlineIcon(
                                  f.airline
                                )}
                              </span>
                            </div>

                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                {f.airline}
                              </p>

                              <p className="text-xs text-gray-500">
                                {
                                  f.flightNumber
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ROUTE */}
                        <div className="md:col-span-7">
                          <div className="flex items-center justify-between gap-2">
                            {/* FROM */}
                            <div className="text-center flex-1">
                              <p className="text-xl md:text-2xl font-bold text-gray-900">
                                {formatTime(
                                  f.timing
                                    .departure
                                    .scheduled
                                )}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(
                                  f.timing
                                    .departure
                                    .scheduled
                                )}
                              </p>

                              <div className="mt-2">
                                <p className="font-bold text-blue-600">
                                  {
                                    f.route
                                      .from
                                      .code
                                  }
                                </p>

                                <p className="text-xs text-gray-500">
                                  {
                                    f.route
                                      .from
                                      .city
                                  }
                                </p>
                              </div>
                            </div>

                            {/* PATH */}
                            <div className="flex-1 px-4">
                              <div className="text-center">
                                <p className="text-xs text-gray-500 mb-2">
                                  {
                                    duration
                                  }
                                </p>

                                <div className="relative">
                                  <div className="border-t-2 border-gray-200 border-dashed"></div>

                                  <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 bg-white p-0.5 rotate-90" />
                                </div>

                                <p className="text-xs mt-2 text-green-600 font-medium">
                                  Direct
                                </p>
                              </div>
                            </div>

                            {/* TO */}
                            <div className="text-center flex-1">
                              <p className="text-xl md:text-2xl font-bold text-gray-900">
                                {formatTime(
                                  f.timing
                                    .arrival
                                    .scheduled
                                )}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(
                                  f.timing
                                    .arrival
                                    .scheduled
                                )}
                              </p>

                              <div className="mt-2">
                                <p className="font-bold text-blue-600">
                                  {
                                    f.route
                                      .to
                                      .code
                                  }
                                </p>

                                <p className="text-xs text-gray-500">
                                  {
                                    f.route
                                      .to
                                      .city
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="md:col-span-3">
                          <div className="flex md:flex-col items-center justify-between md:items-end gap-3">
                            <div className="text-left md:text-right">
                              {discount >
                                15 && (
                                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                                  <TrendingDown className="w-3 h-3" />
                                  {
                                    discount
                                  }
                                  % OFF
                                </div>
                              )}

                              <p className="text-xs text-gray-500">
                                Starting
                                from
                              </p>

                              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                {f.price ||
                                  "N/A"}
                              </p>

                              <p className="text-xs text-gray-400">
                                per adult
                              </p>
                            </div>

                            {/* ✅ FIXED BUTTON */}
                            <button
                              onClick={() =>
                                handleBookFlight(
                                  f,
                                  index
                                )
                              }
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
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;