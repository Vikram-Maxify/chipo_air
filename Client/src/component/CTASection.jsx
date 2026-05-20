import React from "react";
import {
  Plane,
  Hotel,
  Umbrella,
  ArrowRight,
  ShieldCheck,
  Star,
  Wallet,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#eef5ff] py-20 md:py-28">
      
      {/* BACKGROUND SHAPES */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* TOP BADGE */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 shadow-sm rounded-full px-5 py-2">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />

            <span className="text-sm font-semibold text-gray-700">
              Trusted by 2M+ Travelers
            </span>
          </div>
        </div>

        {/* HEADING */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1B1464] leading-tight">
            Book Flights, Hotels &
            <span className="block text-[#2276FF]">
              Holiday Packages
            </span>
          </h2>

          <p className="text-gray-600 text-lg md:text-xl mt-6 leading-8">
            Compare prices, discover exclusive deals, and
            plan your perfect trip — all from one smart
            travel platform.
          </p>
        </div>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          
          {/* FLIGHT */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-50">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
              <Plane className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Flight Booking
            </h3>

            <p className="text-gray-600 leading-7 mb-6">
              Search and compare airfare from top airlines
              with instant booking confirmation.
            </p>

            <button
              onClick={() => navigate("/flights")}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
            >
              Search Flights

              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* HOTEL */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-50">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
              <Hotel className="w-8 h-8 text-orange-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Hotel Booking
            </h3>

            <p className="text-gray-600 leading-7 mb-6">
              Find luxury resorts, premium hotels, and
              affordable stays at the best prices.
            </p>

            <button
              onClick={() => navigate("/hotels")}
              className="flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all"
            >
              Explore Hotels

              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PACKAGE */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-50">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
              <Umbrella className="w-8 h-8 text-purple-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Holiday Packages
            </h3>

            <p className="text-gray-600 leading-7 mb-6">
              Enjoy curated vacation packages with hotels,
              sightseeing, transfers, and more.
            </p>

            <button
              onClick={() => navigate("/packages")}
              className="flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
            >
              View Packages

              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CTA BOX */}
        <div className="bg-gradient-to-r from-[#2276FF] to-[#0057D9] rounded-[32px] p-8 md:p-12 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* LEFT */}
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-black leading-tight mb-5">
                Ready For Your Next Journey?
              </h3>

              <p className="text-blue-100 text-lg leading-8">
                Book flights, hotels, and holiday packages
                at unbeatable prices with secure payment and
                instant confirmation.
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
              >
                Start Booking
              </button>

              <button
                onClick={() => navigate("/packages")}
                className="border-2 border-white/30 hover:border-white bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
              >
                Explore Deals
              </button>
            </div>
          </div>
        </div>

        {/* TRUST FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          
          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-green-500" />

            <div>
              <h4 className="font-bold text-gray-900">
                Secure Booking
              </h4>

              <p className="text-sm text-gray-500">
                100% safe payments
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <Wallet className="w-10 h-10 text-blue-500" />

            <div>
              <h4 className="font-bold text-gray-900">
                Best Price
              </h4>

              <p className="text-sm text-gray-500">
                Guaranteed savings
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <Headphones className="w-10 h-10 text-orange-500" />

            <div>
              <h4 className="font-bold text-gray-900">
                24×7 Support
              </h4>

              <p className="text-sm text-gray-500">
                Always available
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />

            <div>
              <h4 className="font-bold text-gray-900">
                Top Rated
              </h4>

              <p className="text-sm text-gray-500">
                Loved by travelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;