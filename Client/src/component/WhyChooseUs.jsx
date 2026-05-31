import React from "react";

import {
  DollarSign,
  Zap,
  HeadphonesIcon,
  Shield,
  Globe,
  Award,
  Heart,
  Star,
  CheckCircle2,
} from "lucide-react";

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
    desc: "10K+ Reviews",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 md:py-14 bg-[#f8fbff]">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-[#2276FF] text-xs font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4" />
            WHY CHOOSE US
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            Smart & Hassle-Free
            <span className="block text-[#2276FF]">
              Travel Booking
            </span>
          </h2>

          <p className="text-gray-500 text-sm md:text-base leading-7">
            Flights, hotels, and holiday packages with trusted support,
            instant booking, and unbeatable prices.
          </p>
        </div>
        {/* FEATURES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {additionalFeatures.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 text-center hover:border-blue-100 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#2276FF]" />
                </div>

                <h4 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                  {item.title}
                </h4>

                <p className="text-xs md:text-sm text-gray-500">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-[#2276FF] to-[#0057D9] rounded-[28px] p-5 md:p-7 shadow-xl my-10">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center text-white">

    {[
      {
        value: "2M+",
        label: "Happy Travelers",
      },

      {
        value: "500+",
        label: "Airline Partners",
      },

      {
        value: "50K+",
        label: "Hotel Properties",
      },

      {
        value: "4.9★",
        label: "Average Rating",
      },
    ].map((item, i) => (
      <div key={i}>
        <h3 className="text-3xl md:text-4xl font-black mb-1">
          {item.value}
        </h3>

        <p className="text-blue-100 text-sm md:text-base">
          {item.label}
        </p>
      </div>
    ))}
  </div>
</div>
      </div>
    </section>
  );
};

export default WhyChooseUs;