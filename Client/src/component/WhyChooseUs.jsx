import React from "react";
import {
  DollarSign,
  Zap,
  HeadphonesIcon,
  Shield,
  Globe,
  Award,
  Heart,
  Plane,
  Hotel,
  Umbrella,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Plane,
    title: "Flight Booking",
    desc: "Compare fares from top airlines and book domestic & international flights at unbeatable prices.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    to: "/flights",
  },

  {
    icon: Hotel,
    title: "Hotel Reservations",
    desc: "Discover luxury resorts, premium hotels, and budget stays with instant booking confirmation.",
    color: "from-orange-500 to-yellow-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
    to: "/hotels",
  },

  {
    icon: Umbrella,
    title: "Holiday Packages",
    desc: "Explore curated honeymoon, family, and adventure holiday packages with exclusive discounts.",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    to: "/packages",
  },
];

const additionalFeatures = [
  {
    icon: DollarSign,
    title: "Best Price",
    desc: "Guaranteed Deals",
  },

  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Fast Confirmation",
  },

  {
    icon: Shield,
    title: "Secure Payments",
    desc: "100% Safe Checkout",
  },

  {
    icon: Globe,
    title: "Global Coverage",
    desc: "500+ Destinations",
  },

  {
    icon: HeadphonesIcon,
    title: "24×7 Support",
    desc: "Travel Assistance",
  },

  {
    icon: Award,
    title: "Top Rated",
    desc: "Trusted by Travelers",
  },

  {
    icon: Heart,
    title: "Flexible Plans",
    desc: "Easy Cancellation",
  },

  {
    icon: Star,
    title: "4.9 Rating",
    desc: "10K+ Happy Reviews",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-6 md:py-6 bg-gradient-to-b from-white via-[#f7fbff] to-[#eef5ff] overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <CheckCircle2 className="w-4 h-4" />
            WHY TRAVELERS CHOOSE US
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-tight mb-6">
            Your Complete
            <span className="block bg-gradient-to-r from-[#2276FF] to-[#0057D9] bg-clip-text text-transparent">
              Travel Booking Platform
            </span>
          </h2>

          <p className="text-gray-600 text-lg md:text-xl leading-8">
            Book flights, hotels, and holiday packages with
            confidence using our smart booking platform built
            for modern travelers.
          </p>
        </div>

        {/* MAIN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-16">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="group relative bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                
                {/* TOP GRADIENT */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}
                />

                {/* ICON */}
                <div
                  className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <Icon
                    className={`w-8 h-8 ${item.iconColor}`}
                  />
                </div>

                {/* CONTENT */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-8 mb-6">
                  {item.desc}
                </p>

                {/* BUTTON */}
                <Link
                  to={item.to}
                  className="group/btn inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-all">
                  Explore More

                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-all" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* STATS SECTION */}
        <div className="bg-gradient-to-r from-[#2276FF] to-[#0057D9] rounded-[36px] p-8 md:p-12 shadow-2xl mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            
            <div>
              <h3 className="text-4xl md:text-5xl font-black mb-2">
                2M+
              </h3>

              <p className="text-blue-100">
                Happy Travelers
              </p>
            </div>

            <div>
              <h3 className="text-4xl md:text-5xl font-black mb-2">
                500+
              </h3>

              <p className="text-blue-100">
                Airline Partners
              </p>
            </div>

            <div>
              <h3 className="text-4xl md:text-5xl font-black mb-2">
                50K+
              </h3>

              <p className="text-blue-100">
                Hotel Properties
              </p>
            </div>

            <div>
              <h3 className="text-4xl md:text-5xl font-black mb-2">
                4.9★
              </h3>

              <p className="text-blue-100">
                Average Rating
              </p>
            </div>
          </div>
        </div>

        {/* ADDITIONAL FEATURES */}
        <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm p-8 md:p-10">
          
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-gray-900 mb-4">
              Everything You Need For Stress-Free Travel
            </h3>

            <p className="text-gray-500 text-lg">
              Experience smarter booking with premium travel
              benefits and trusted support.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {additionalFeatures.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-[#f4f8ff] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-all">
                    <Icon className="w-7 h-7 text-[#2276FF]" />
                  </div>

                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    {item.title}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;