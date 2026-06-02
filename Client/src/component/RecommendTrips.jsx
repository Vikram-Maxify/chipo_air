import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrips } from "../reducer/slice/recommendTripSlice";

const RecommendTrips = () => {
  const dispatch = useDispatch();

  const { trips, loading } = useSelector((state) => state.recommendTrip);

  useEffect(() => {
    dispatch(fetchAllTrips());
  }, [dispatch]);

  return (
    <div className="bg-[#f6f7fb] min-h-screen px-6 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-[#111827]">
          Recommended for your next trip
        </h1>
        <p className="text-gray-500 mt-1">
          Based on your most recent searches or your location
        </p>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center text-gray-500">Loading trips...</p>}

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trips?.map((trip) => (
          <div
            key={trip._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-44 object-cover"
              />

              {/* BADGE */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                ✈ Recommended
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-4">
              {/* PRICE + TITLE */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-[#111827]">
                  {trip.location}
                </h2>

                <div className="text-right">
                  <p className="text-lg font-bold text-[#2563eb]">
                    ₹ {trip.price}
                  </p>
                  <p className="text-xs text-gray-500">Round Trip</p>
                </div>
              </div>

              {/* ROUTE */}
              <p className="text-sm text-gray-500 mt-1">{trip.title}</p>

              {/* META */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-gray-500">⏳ {trip.duration}</div>

                <div className="text-xs text-yellow-500 font-semibold">
                  ⭐ {trip.rating}
                </div>
              </div>

              {/* BOTTOM BAR (like flight UI) */}
              <div className="mt-4 border-t pt-3 flex justify-between items-center">
                <p className="text-xs text-gray-400">View details →</p>

                <button className="bg-[#2563eb] text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {!loading && trips?.length === 0 && (
        <p className="text-center text-gray-400 mt-20">No trips found</p>
      )}
    </div>
  );
};

export default RecommendTrips;
