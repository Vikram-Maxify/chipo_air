import React, { useState } from "react";
import { Calendar, Users, Search, ArrowLeftRight } from "lucide-react";
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

  // 🔁 Swap cities
  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  // 🔍 Search handler
  const handleSearch = async () => {
    if (!from || !to) {
      alert("From & To required");
      return;
    }

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
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white">

      {/* overlay */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-5xl font-semibold mb-4">
            Find Your Perfect Flight ✈️
          </h1>
          <p className="text-blue-100 text-sm md:text-lg">
            Compare & book cheapest flights instantly
          </p>
        </div>

        {/* Form */}
        <div className="bg-white text-black rounded-2xl shadow-xl p-4 sm:p-6">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">

            {/* FROM */}
            <div className="lg:col-span-3">
              <label className="text-sm text-gray-600">From</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                placeholder="DEL"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* SWAP */}
            <div className="hidden lg:flex items-end justify-center">
              <button
                onClick={swapLocations}
                className="p-2 border rounded-full hover:bg-gray-100 transition"
              >
                <ArrowLeftRight />
              </button>
            </div>

            {/* TO */}
            <div className="lg:col-span-3">
              <label className="text-sm text-gray-600">To</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                placeholder="BOM"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* DEPARTURE */}
            <div className="lg:col-span-2">
              <label className="text-sm text-gray-600">Departure</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* RETURN */}
            {tripType === "roundtrip" && (
              <div className="lg:col-span-2">
                <label className="text-sm text-gray-600">Return</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* PASSENGERS */}
            <div className="lg:col-span-2">
              <label className="text-sm text-gray-600">Passengers</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="lg:col-span-12">
              <button
                onClick={handleSearch}
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <Search size={18} />
                Search Flights
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;