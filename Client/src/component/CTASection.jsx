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
import Banners from "./Banners";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#f5f9ff] py-12 md:py-16">

  {/* BG */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />

    <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30" />
  </div>

  <div className="relative max-w-7xl mx-auto px-4">

    {/* BADGE */}
    <div className="flex justify-center mb-4">
      <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 shadow-sm">
        <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />

        <span className="text-xs md:text-sm font-semibold text-gray-700">
          Trusted by 2M+ Travelers
        </span>
      </div>
    </div>

    {/* HEADING */}
    <div className="text-center max-w-3xl mx-auto mb-10">

      <h2 className="text-3xl md:text-4xl font-black text-[#1B1464] leading-tight">
        Book Flights, Hotels &
        <span className="block text-[#2276FF]">
          Holiday Packages
        </span>
      </h2>

      <p className="text-sm md:text-base text-gray-500 mt-4 leading-7">
        Compare prices, discover exclusive deals, and plan your
        perfect trip from one smart travel platform.
      </p>
    </div>

    {/* SERVICE CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

      {/* FLIGHT */}
      <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
          <Plane className="w-6 h-6 text-blue-600" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Flight Booking
        </h3>

        <p className="text-sm text-gray-500 leading-6 mb-4">
          Compare airfare from top airlines with instant booking.
        </p>

        <button
          onClick={() => navigate("/flights")}
          className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:gap-3 transition-all"
        >
          Search Flights

          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* HOTEL */}
      <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
          <Hotel className="w-6 h-6 text-orange-500" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Hotel Booking
        </h3>

        <p className="text-sm text-gray-500 leading-6 mb-4">
          Find luxury resorts and affordable stays at great prices.
        </p>

        <button
          onClick={() => navigate("/hotels")}
          className="flex items-center gap-2 text-sm text-orange-500 font-semibold hover:gap-3 transition-all"
        >
          Explore Hotels

          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* PACKAGE */}
      <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
          <Umbrella className="w-6 h-6 text-purple-600" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Holiday Packages
        </h3>

        <p className="text-sm text-gray-500 leading-6 mb-4">
          Curated vacations with hotels, sightseeing & transfers.
        </p>

        <button
          onClick={() => navigate("/packages")}
          className="flex items-center gap-2 text-sm text-purple-600 font-semibold hover:gap-3 transition-all"
        >
          View Packages

          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* BANNER */}
    <div className="mb-10">
      <Banners
        index={5}
        height="h-[140px] md:h-[170px]"
        className=""
      />
    </div>

    {/* TRUST FEATURES */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {[
        {
          icon: ShieldCheck,
          title: "Secure Booking",
          desc: "Safe payments",
          color: "text-green-500",
        },

        {
          icon: Wallet,
          title: "Best Price",
          desc: "Guaranteed savings",
          color: "text-blue-500",
        },

        {
          icon: Headphones,
          title: "24×7 Support",
          desc: "Always available",
          color: "text-orange-500",
        },

        {
          icon: Star,
          title: "Top Rated",
          desc: "Loved by travelers",
          color: "text-yellow-500",
        },
      ].map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm"
          >
            <Icon className={`w-8 h-8 ${item.color}`} />

            <div>
              <h4 className="font-semibold text-sm text-gray-900">
                {item.title}
              </h4>

              <p className="text-xs text-gray-500">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>
  );
};

export default CTASection;