/* pages/Testimonials.jsx */

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { getAllTestimonials } from "../reducer/slice/testimonialSlice";

const Testimonials = () => {
  const dispatch = useDispatch();

  const { testimonials, loading, error } = useSelector(
    (state) => state.testimonials
  );

  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    dispatch(getAllTestimonials());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!testimonials?.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev + itemsPerView >= testimonials.length
          ? 0
          : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials, itemsPerView]);

  const visibleTestimonials = useMemo(() => {
    return testimonials?.slice(
      current,
      current + itemsPerView
    );
  }, [testimonials, current, itemsPerView]);

  const handlePrev = () => {
    setCurrent((prev) =>
      prev === 0
        ? Math.max(
            testimonials.length - itemsPerView,
            0
          )
        : prev - 1
    );
  };

  const handleNext = () => {
    setCurrent((prev) =>
      prev + itemsPerView >= testimonials.length
        ? 0
        : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-xl font-semibold">
        Loading testimonials...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <span className="inline-flex px-5 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wide">
              CLIENT TESTIMONIALS
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-5 leading-tight">
              People Who Trusted <br />
              Our Travel Experience
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* EMPTY */}
        {!testimonials?.length ? (
          <div className="text-center text-gray-500 py-20">
            No testimonials found.
          </div>
        ) : (
          <>
            {/* CARDS */}
            <div
              className={`grid gap-7 transition-all duration-500 ${
                itemsPerView === 1
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {visibleTestimonials.map((item) => (
                <div
                  key={item._id}
                  className="relative bg-white rounded-[30px] p-7 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                >
                  {/* TOP GLOW */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                  {/* QUOTE ICON */}
                  <div className="absolute -top-2 right-5 opacity-10 group-hover:opacity-20 transition-all">
                    <Quote size={90} />
                  </div>

                  {/* USER */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
                    />

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="text-sm font-semibold text-blue-600 mt-1">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-1 mb-5">
                    {Array(item.rating || 5)
                      .fill()
                      .map((_, index) => (
                        <span
                          key={index}
                          className="text-yellow-400 text-xl"
                        >
                          ★
                        </span>
                      ))}
                  </div>

                  {/* MESSAGE */}
                  <p className="text-gray-600 leading-8 text-[15px] relative z-10">
                    {item.reviewMessage}
                  </p>

                  {/* DATE */}
                  <div className="mt-7 pt-5 border-t border-gray-100 text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* DOTS */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-8 h-2 bg-black"
                      : "w-2 h-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;