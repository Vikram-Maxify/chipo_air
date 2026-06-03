import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrips } from "../reducer/slice/recommendTripSlice";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RecommendTrips = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  const { trips, loading } = useSelector(
    (state) => state.recommendTrip,
  );

  useEffect(() => {
    dispatch(fetchAllTrips());
  }, [dispatch]);

  useEffect(() => {
    const checkScrollability = () => {
      if (scrollContainerRef.current && trips?.length > 0) {
        const container = scrollContainerRef.current;
        const isScrollable = container.scrollWidth > container.clientWidth;
        setCanScroll(isScrollable);
        
        // Check if we can scroll left/right
        const hasLeftScroll = container.scrollLeft > 0;
        const hasRightScroll = container.scrollLeft + container.clientWidth < container.scrollWidth;
        setShowLeftArrow(hasLeftScroll);
        setShowRightArrow(hasRightScroll);
      }
    };

    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    
    return () => window.removeEventListener('resize', checkScrollability);
  }, [trips]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const hasLeftScroll = container.scrollLeft > 0;
      const hasRightScroll = container.scrollLeft + container.clientWidth < container.scrollWidth;
      setShowLeftArrow(hasLeftScroll);
      setShowRightArrow(hasRightScroll);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

  return (
    <section className="bg-[#f8f9fa] py-12 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-[28px] md:text-[42px] font-semibold text-[#0b2a6f] leading-tight">
            Recommended for your next trip
          </h2>

          <p className="mt-2 text-[15px] md:text-[20px] text-[#3c4043]">
            Based on your most recent searches or your location
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading trips...
          </div>
        )}

        {/* TRIPS - SLIDER SECTION */}
        {!loading && trips?.length > 0 && (
          <div className="relative group">
            {/* Left Arrow */}
            {canScroll && showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity border border-gray-200"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {/* Right Arrow */}
            {canScroll && showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 border border-gray-200"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={`
                overflow-x-auto scroll-smooth
                ${canScroll ? 'overflow-x-auto' : 'overflow-x-hidden'}
                [&::-webkit-scrollbar]:h-2
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:hover:bg-gray-400
              `}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}
            >
              <div className={`
                flex gap-6
                ${!canScroll ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : ''}
                pb-4
              `}>
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    onClick={() => handleSearchFlight(trip)}
                    className={`
                      bg-white
                      border
                      border-[#dadce0]
                      rounded-[24px]
                      overflow-hidden
                      cursor-pointer
                      transition-all
                      hover:shadow-lg
                      flex-shrink-0
                      ${canScroll ? 'w-[280px] md:w-[300px]' : 'w-full'}
                    `}
                  >
                    {/* IMAGE */}
                    <div className="h-[185px] overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* CARD CONTENT */}
                    <div className="p-5">
                      {/* PRICE RANGE */}
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <p className="text-[15px] leading-5 text-[#5f6368]">
                            {trip.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex overflow-hidden rounded-full">
                            <div className="w-4 h-2 bg-green-500" />
                            <div className="w-4 h-2 bg-yellow-400" />
                            <div className="w-4 h-2 bg-red-500" />
                          </div>
                        </div>
                      </div>

                      {/* DESTINATION + PRICE */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-[20px] font-semibold text-[#202124] leading-6">
                            {trip.title}
                          </h3>

                          <p className="mt-1 text-[15px] text-[#5f6368]">
                            {trip.from} – {trip.to}
                          </p>

                          <p className="text-[15px] text-[#5f6368]">
                            {formatDate(trip.startDate)}
                            {" – "}
                            {formatDate(trip.endDate)}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <h3 className="text-[20px] font-semibold text-[#202124]">
                            ${trip.price}
                          </h3>

                          <p className="text-[15px] text-[#5f6368]">
                            Round Trip
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Indicators (Optional - shows when scrollable but arrows hidden) */}
            {canScroll && !showLeftArrow && !showRightArrow && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mt-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              </div>
            )}
          </div>
        )}

        {/* EMPTY */}
        {!loading && trips?.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            No trips found
          </div>
        )}

        {/* FOOTER */}
        {!loading && trips?.length > 0 && (
          <p className="mt-4 text-[14px] text-[#5f6368]">
            *Rates last found on{" "}
            {new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </section>
  );
};

export default RecommendTrips;