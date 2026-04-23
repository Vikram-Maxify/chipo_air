import React, { useState } from "react";
import { Calendar, Users, Search, ArrowLeftRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { getFlightsThunk } from "../reducer/slice/flightsSlice";

const Hero = () => {
  const dispatch = useDispatch();

  const [tripType, setTripType] = useState("roundtrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  // ✅ FIXED SEARCH HANDLER
  const handleSearch = () => {
    if (!from || !to) {
      alert("From & To required");
      return;
    }

    // 🔥 ONLY send required data (matches reducer)
    dispatch(getFlightsThunk({ from, to }));
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white">

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl font-semibold mb-4">
            Find Your Perfect Flight ✈️
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white text-black rounded-2xl shadow-xl p-6">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">

            {/* FROM */}
            <div className="lg:col-span-3">
              <label className="text-sm">From</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                placeholder="DEL"
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* SWAP */}
            <div className="hidden lg:flex items-end justify-center">
              <button onClick={swapLocations} className="p-2 border rounded-full">
                <ArrowLeftRight />
              </button>
            </div>

            {/* TO */}
            <div className="lg:col-span-3">
              <label className="text-sm">To</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                placeholder="BOM"
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* START DATE */}
            <div className="lg:col-span-2">
              <label className="text-sm">Departure</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* END DATE */}
            {tripType === "roundtrip" && (
              <div className="lg:col-span-2">
                <label className="text-sm">Return</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border p-3 rounded-lg"
                />
              </div>
            )}

            {/* PASSENGERS */}
            <div className="lg:col-span-2">
              <label className="text-sm">Passengers</label>
              <input
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* SEARCH BUTTON */}
            <div className="lg:col-span-12">
              <button
                onClick={handleSearch}
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center gap-2 hover:bg-blue-700"
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