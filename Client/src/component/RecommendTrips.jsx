import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrips } from "../reducer/slice/recommendTripSlice";

// Lucide Icons
import { Plane, MapPin, CalendarDays, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecommendTrips = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSearchFlight = (trip) => {
    navigate(
      `/flights?from=${trip.from}&to=${trip.to}&departure_date=${trip.startDate}&return_date=${trip.endDate}`,
      {
        state: {
          fromCode: trip.from,
          toCode: trip.to,
          departureDate: trip.startDate,
          returnDate: trip.endDate,

          recommendedTrip: true,
        },
      },
    );
  };

  const { trips, loading } = useSelector((state) => state.recommendTrip);

  useEffect(() => {
    dispatch(fetchAllTrips());
  }, [dispatch]);

  return (
    <div className="bg-[#f6f7fb] px-6 py-10">
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
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-44 object-cover"
              />

              {/* BADGE */}
              <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                Recommended
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-4">
              {/* TITLE + PRICE */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">
                    {trip.title}
                  </h2>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin size={14} />
                    {trip.location}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-[#2563eb]">
                    $ {trip.price}
                  </p>
                  <p className="text-xs text-gray-500">Round Trip</p>
                </div>
              </div>

              {/* ROUTE */}
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Plane size={16} />
                {trip.from} → {trip.to}
              </div>

              {/* DESCRIPTION */}
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {trip.description}
              </p>

              {/* DATES */}
              <div className="mt-3 text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  {new Date(trip.startDate).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  {new Date(trip.endDate).toLocaleDateString()}
                </div>
              </div>

              {/* META */}
              <div className="flex justify-between items-center mt-4">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14} />
                  {trip.duration} Days
                </span>

                <span className="flex items-center gap-1 text-xs font-semibold text-yellow-500">
                  <Star size={14} />
                  {trip.rating}
                </span>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => handleSearchFlight(trip)}
                className="
        w-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        py-3
        rounded-xl
        font-semibold
        transition-all
    "
              >
                View Flights
              </button>
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
