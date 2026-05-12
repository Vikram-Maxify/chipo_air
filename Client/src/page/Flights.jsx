import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Plane,
  ChevronDown,
  TrendingDown,
  AlertCircle,
  Navigation,
  Users,
  ArrowLeftRight,
  Search,
  MapPin,
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

const Flights = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const params =
    new URLSearchParams(
      location.search
    );

  const fromQuery =
    params.get("from");

  const toQuery =
    params.get("to");

  const departureDateQuery =
    params.get(
      "departure_date"
    );

  const {
    flights,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.flights
  );

  // FILTER STATES
  const [
    filterAirline,
    setFilterAirline,
  ] = useState("all");

  const [
    selectedStops,
    setSelectedStops,
  ] = useState("nonstop");

  const [
    selectedAirports,
    setSelectedAirports,
  ] = useState([]);

  const [
    maxDuration,
    setMaxDuration,
  ] = useState(210);

  // SEARCH STATES
  const [tripType, setTripType] =
    useState("roundtrip");

  const [from, setFrom] =
    useState(
      fromQuery || ""
    );

  const [to, setTo] =
    useState(
      toQuery || ""
    );

  const [
    passengers,
    setPassengers,
  ] = useState(1);

  const [
    isSearchLoading,
    setIsSearchLoading,
  ] = useState(false);

  // CALENDAR
  const [
    showCalendar,
    setShowCalendar,
  ] = useState(false);

  const [
    dateRange,
    setDateRange,
  ] = useState([
    {
      startDate:
        departureDateQuery
          ? new Date(
              departureDateQuery
            )
          : addDays(
              new Date(),
              1
            ),

      endDate: addDays(
        new Date(),
        3
      ),

      key: "selection",
    },
  ]);

  const swapLocations =
    () => {
      setFrom(to);
      setTo(from);
    };

  const handleSearch =
    async () => {
      if (!from || !to) {
        alert(
          "Please enter both departure and destination cities"
        );

        return;
      }

      const startDate =
        format(
          dateRange[0]
            .startDate,
          "yyyy-MM-dd"
        );

      const endDate =
        format(
          dateRange[0]
            .endDate,
          "yyyy-MM-dd"
        );

      setIsSearchLoading(
        true
      );

      try {
        const resultAction =
          await dispatch(
            getFlightsThunk(
              {
                from,
                to,

                departure_date:
                  startDate,

                return_date:
                  tripType ===
                  "roundtrip"
                    ? endDate
                    : null,

                passengers,
              }
            )
          );

        if (
          getFlightsThunk.fulfilled.match(
            resultAction
          )
        ) {
          navigate(
            `/flights?from=${from}&to=${to}&departure_date=${startDate}`
          );
        }
      } catch (err) {
        console.log(
          "Search error:",
          err
        );

        alert(
          "Failed to search flights."
        );
      } finally {
        setIsSearchLoading(
          false
        );
      }
    };

  const handleBookFlight =
    (flight) => {
      navigate(
        `/flights/booking/${flight.offerId}`,
        {
          state: {
            flight,
          },
        }
      );
    };

  const formatTime = (
    date
  ) =>
    new Date(
      date
    ).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  const formatDate = (
    date
  ) =>
    new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }
    );

  const getAirlineIcon = (
    airline
  ) => {
    const airlines = {
      IndiGo: "🔵",
      "Air India":
        "🔴",
      SpiceJet: "🟡",
      Vistara: "🟣",
      "Go First":
        "⚪",
    };

    return (
      airlines[airline] ||
      "✈️"
    );
  };

  const getDuration = (
    departure,
    arrival
  ) => {
    const diff =
      new Date(arrival) -
      new Date(departure);

    const hours =
      Math.floor(
        diff /
          (1000 *
            60 *
            60)
      );

    const minutes =
      Math.floor(
        (diff %
          (1000 *
            60 *
            60)) /
          (1000 * 60)
      );

    return `${hours}h ${minutes}m`;
  };

  const popularCities = [
    {
      code: "DEL",
      name: "New Delhi",
    },

    {
      code: "BOM",
      name: "Mumbai",
    },

    {
      code: "BLR",
      name: "Bangalore",
    },

    {
      code: "HYD",
      name: "Hyderabad",
    },
  ];

  useEffect(() => {
    window.scrollTo(
      0,
      0
    );
  }, []);

  const uniqueAirlines = [
    ...new Set(
      flights.map(
        (f) =>
          f.airline
      )
    ),
  ];

  // FILTERED FLIGHTS
  const filteredFlights =
    flights.filter(
      (f) => {
        const matchAirline =
          filterAirline ===
            "all" ||
          f.airline ===
            filterAirline;

        const durationMinutes =
          (new Date(
            f.timing
              .arrival
              .scheduled
          ) -
            new Date(
              f.timing
                .departure
                .scheduled
            )) /
          (1000 * 60);

        const matchDuration =
          durationMinutes <=
          maxDuration;

        const matchAirport =
          selectedAirports
            .length ===
            0 ||
          selectedAirports.includes(
            f.route.to
              .code
          );

        return (
          matchAirline &&
          matchDuration &&
          matchAirport
        );
      }
    );

if (
  loading ||
  isSearchLoading
) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">

      <div className="text-center">

        <div className="relative">

          {/* SPINNER */}
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          {/* FLIGHT ICON */}
          <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8 animate-pulse" />
        </div>

        <p className="mt-4 text-gray-700 font-semibold text-lg">
          Searching Flights...
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Finding best deals for you
        </p>
      </div>
    </div>
  );
}

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold mb-2">
            Something
            went wrong
          </h2>

          <p className="text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* SEARCH */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pb-10">

        <div className="max-w-7xl mx-auto px-4 pt-6">

          {/* TRIP TYPE */}
          <div className="flex justify-center mb-6">

            <div className="bg-white/10 rounded-xl p-1 flex gap-2">

              <button
                onClick={() =>
                  setTripType(
                    "roundtrip"
                  )
                }
                className={`px-5 py-2 rounded-lg font-semibold ${
                  tripType ===
                  "roundtrip"
                    ? "bg-white text-black"
                    : "text-white"
                }`}
              >
                Round Trip
              </button>

              <button
                onClick={() =>
                  setTripType(
                    "oneway"
                  )
                }
                className={`px-5 py-2 rounded-lg font-semibold ${
                  tripType ===
                  "oneway"
                    ? "bg-white text-black"
                    : "text-white"
                }`}
              >
                One Way
              </button>
            </div>
          </div>

          {/* SEARCH BOX */}
          {/* SEARCH BOX */}
<div className="bg-white rounded-3xl p-4 md:p-6 shadow-2xl">
  <div className="flex flex-col gap-4">

    {/* TOP ROW */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">

      {/* FROM */}
      <div className="xl:col-span-3">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          From
        </label>

        <input
          value={from}
          onChange={(e) =>
            setFrom(
              e.target.value.toUpperCase()
            )
          }
          placeholder="Delhi"
          className="w-full h-[58px] border-2 border-gray-200 rounded-2xl px-4 outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* SWAP */}
      <div className="xl:col-span-1 flex justify-center items-end">
        <button
          onClick={swapLocations}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all mt-auto"
        >
          <ArrowLeftRight size={18} />
        </button>
      </div>

      {/* TO */}
      <div className="xl:col-span-3">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          To
        </label>

        <input
          value={to}
          onChange={(e) =>
            setTo(
              e.target.value.toUpperCase()
            )
          }
          placeholder="Mumbai"
          className="w-full h-[58px] border-2 border-gray-200 rounded-2xl px-4 outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* DATE RANGE */}
      <div className="xl:col-span-3 relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Departure & Return
        </label>

        <button
          onClick={() =>
            setShowCalendar(
              !showCalendar
            )
          }
          className="w-full h-[58px] border-2 border-gray-200 rounded-2xl px-4 text-left hover:border-blue-500 transition-all bg-white"
        >
          <div className="flex items-center justify-between gap-3">

            {/* Departure */}
            <div>
              <p className="text-[11px] text-gray-500">
                Departure
              </p>

              <p className="font-bold text-sm md:text-base text-gray-900 whitespace-nowrap">
                {format(
                  dateRange[0]
                    .startDate,
                  "dd MMM"
                )}
              </p>
            </div>

            {/* Divider */}
            {tripType ===
              "roundtrip" && (
              <div className="h-8 w-px bg-gray-200"></div>
            )}

            {/* Return */}
            {tripType ===
              "roundtrip" && (
              <div className="text-right">
                <p className="text-[11px] text-gray-500">
                  Return
                </p>

                <p className="font-bold text-sm md:text-base text-gray-900 whitespace-nowrap">
                  {format(
                    dateRange[0]
                      .endDate,
                    "dd MMM"
                  )}
                </p>
              </div>
            )}
          </div>
        </button>

        {/* CALENDAR */}
        {showCalendar && (
          <div className="absolute left-1/2 xl:left-auto -translate-x-1/2 xl:translate-x-0 xl:right-0 z-50 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-w-[95vw]">

            <div className="overflow-auto">
              <DateRange
                editableDateInputs={
                  true
                }
                onChange={(item) =>
                  setDateRange([
                    item.selection,
                  ])
                }
                moveRangeOnFirstSelection={
                  false
                }
                ranges={
                  dateRange
                }
                months={
                  window.innerWidth <
                  768
                    ? 1
                    : 2
                }
                direction="horizontal"
                minDate={addDays(
                  new Date(),
                  1
                )}
                rangeColors={[
                  "#2563eb",
                ]}
              />
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() =>
                  setShowCalendar(
                    false
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PASSENGERS */}
      <div className="xl:col-span-1">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Travellers
        </label>

        <select
          value={passengers}
          onChange={(e) =>
            setPassengers(
              Number(
                e.target.value
              )
            )
          }
          className="w-full h-[58px] border-2 border-gray-200 rounded-2xl px-4 outline-none focus:border-blue-500 transition-all"
        >
          {[1, 2, 3, 4, 5].map(
            (n) => (
              <option
                key={n}
              >
                {n}
              </option>
            )
          )}
        </select>
      </div>

      {/* SEARCH BUTTON */}
      <div className="xl:col-span-1 flex items-end">
        <button
          onClick={handleSearch}
          className="w-full h-[58px] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Search size={20} />
        </button>
      </div>
    </div>

    {/* POPULAR CITIES */}
    <div className="flex flex-wrap gap-2 pt-2">
      {popularCities.map(
        (city) => (
          <button
            key={city.code}
            onClick={() =>
              setTo(city.code)
            }
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium transition-all"
          >
            {city.name}
          </button>
        )
      )}
    </div>
  </div>
</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-3">

            <div className="bg-white rounded-3xl shadow-lg p-5 sticky top-4">

              <div className="flex justify-between items-center mb-5">

                <h2 className="font-bold text-xl">
                  Filters
                </h2>

                <button
                  onClick={() => {
                    setFilterAirline(
                      "all"
                    );

                    setSelectedAirports(
                      []
                    );

                    setMaxDuration(
                      210
                    );
                  }}
                  className="text-blue-600 text-sm"
                >
                  Clear
                </button>
              </div>

              {/* AIRLINE */}
              <div className="mb-6">

                <h3 className="font-semibold mb-3">
                  Airlines
                </h3>

                <select
                  value={
                    filterAirline
                  }
                  onChange={(
                    e
                  ) =>
                    setFilterAirline(
                      e.target
                        .value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="all">
                    All
                  </option>

                  {uniqueAirlines.map(
                    (
                      airline
                    ) => (
                      <option
                        key={
                          airline
                        }
                        value={
                          airline
                        }
                      >
                        {
                          airline
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* AIRPORTS */}
              <div className="mb-6">

                <h3 className="font-semibold mb-3">
                  Airports
                </h3>

                <div className="space-y-3">

                  {[
                    ...new Set(
                      flights.map(
                        (f) =>
                          f.route
                            .to
                            .code
                      )
                    ),
                  ].map(
                    (
                      airport
                    ) => (
                      <label
                        key={
                          airport
                        }
                        className="flex items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAirports.includes(
                            airport
                          )}
                          onChange={() => {
                            if (
                              selectedAirports.includes(
                                airport
                              )
                            ) {
                              setSelectedAirports(
                                selectedAirports.filter(
                                  (
                                    a
                                  ) =>
                                    a !==
                                    airport
                                )
                              );
                            } else {
                              setSelectedAirports(
                                [
                                  ...selectedAirports,
                                  airport,
                                ]
                              );
                            }
                          }}
                        />

                        {airport}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* DURATION */}
              <div>

                <div className="flex justify-between mb-3">

                  <h3 className="font-semibold">
                    Duration
                  </h3>

                  <span className="text-sm text-gray-500">
                    {Math.floor(
                      maxDuration /
                        60
                    )}
                    h{" "}
                    {maxDuration %
                      60}
                    m
                  </span>
                </div>

                <input
                  type="range"
                  min="60"
                  max="600"
                  value={
                    maxDuration
                  }
                  onChange={(
                    e
                  ) =>
                    setMaxDuration(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* FLIGHTS */}
          <div className="lg:col-span-9">

            {filteredFlights.length ===
            0 ? (
              <div className="bg-white rounded-3xl p-10 text-center">

                <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />

                <h2 className="text-2xl font-bold mb-2">
                  No Flights
                  Found
                </h2>

                <p className="text-gray-500">
                  Try changing
                  filters
                </p>
              </div>
            ) : (
              <div className="space-y-5">

                {filteredFlights.map(
                  (
                    f,
                    index
                  ) => {
                    const duration =
                      getDuration(
                        f
                          .timing
                          .departure
                          .scheduled,
                        f
                          .timing
                          .arrival
                          .scheduled
                      );

                    const discount =
                      Math.floor(
                        Math.random() *
                          25
                      ) + 5;

                    return (
                      <div
                        key={index}
                        className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
                      >
                        <div className="p-6">

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">

                            {/* AIRLINE */}
                            <div className="md:col-span-2">

                              <div className="flex items-center gap-3">

                                <div className="bg-gray-100 p-3 rounded-xl">
                                  <span className="text-2xl">
                                    {getAirlineIcon(
                                      f.airline
                                    )}
                                  </span>
                                </div>

                                <div>
                                  <p className="font-bold">
                                    {
                                      f.airline
                                    }
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

                              <div className="flex items-center justify-between">

                                <div className="text-center">
                                  <p className="text-2xl font-bold">
                                    {formatTime(
                                      f
                                        .timing
                                        .departure
                                        .scheduled
                                    )}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    {
                                      f
                                        .route
                                        .from
                                        .code
                                    }
                                  </p>
                                </div>

                                <div className="flex-1 px-5 text-center">

                                  <p className="text-sm text-gray-500 mb-2">
                                    {
                                      duration
                                    }
                                  </p>

                                  <div className="relative">

                                    <div className="border-t-2 border-dashed border-gray-300"></div>

                                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 rotate-90 w-5 h-5" />
                                  </div>

                                  <p className="text-xs text-green-600 mt-2 font-semibold">
                                    Direct
                                  </p>
                                </div>

                                <div className="text-center">
                                  <p className="text-2xl font-bold">
                                    {formatTime(
                                      f
                                        .timing
                                        .arrival
                                        .scheduled
                                    )}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    {
                                      f
                                        .route
                                        .to
                                        .code
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* PRICE */}
                            <div className="md:col-span-3 text-right">

                              {discount >
                                15 && (
                                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold mb-2">

                                  <TrendingDown className="w-3 h-3" />

                                  {
                                    discount
                                  }
                                  % OFF
                                </div>
                              )}

                              <p className="text-3xl font-bold">
                                {f.price ||
                                  "N/A"}
                              </p>

                              <p className="text-xs text-gray-400 mb-4">
                                per adult
                              </p>

                              <button
                                onClick={() =>
                                  handleBookFlight(
                                    f
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
                              >
                                Book
                                Now
                              </button>
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
      </div>
    </div>
  );
};

export default Flights;