import React from "react";
import { 
  DollarSign, 
  Zap, 
  HeadphonesIcon, 
  Shield, 
  Globe, 
  Award,
  Heart
} from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Best Price Guarantee",
    desc: "Compare hundreds of airlines to find the cheapest flights with our price match promise.",
  },
  {
    icon: Zap,
    title: "Fast & Easy Booking",
    desc: "Book your flight in under 2 minutes with our streamlined and intuitive process.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Customer Support",
    desc: "Our team is always available to help you with any queries or issues anytime.",
  },
];

const additionalFeatures = [
  { icon: Shield, title: "Secure Payments", desc: "256-bit SSL encryption" },
  { icon: Globe, title: "Global Coverage", desc: "500+ airlines worldwide" },
  { icon: Award, title: "Top Rated", desc: "4.8/5 from 10K+ reviews" },
  { icon: Heart, title: "Flexible Booking", desc: "Free cancellation" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why Choose FlightBooker?
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            We make travel planning simple with features designed for the best experience
          </p>
        </div>

        {/* Main Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {additionalFeatures.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center sm:text-left">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-3 mx-auto sm:mx-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
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