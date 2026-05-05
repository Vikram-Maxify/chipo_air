import React from "react";
import { ArrowRight, Plane, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-24 md:py-32 lg:py-40">
  
  {/* Background */}
  <div className="absolute inset-0">
    <div className="absolute top-10 left-10 opacity-10 animate-float">
      <Plane size={60} />
    </div>
    <div className="absolute bottom-10 right-20 opacity-10 animate-float animation-delay-2000">
      <Plane size={40} />
    </div>

    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
  </div>

  {/* CONTENT */}
  <div className="relative max-w-6xl mx-auto px-4 text-center">
    
    {/* Badge */}
    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8">
      <Sparkles className="w-4 h-4 text-yellow-300" />
      <span className="text-sm text-blue-100">Limited Time Offers Available</span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
      Ready to Book Your
      <span className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
        Next Adventure?
      </span>
    </h2>

    {/* Description */}
    <p className="text-lg md:text-xl text-blue-100/90 mb-12 max-w-3xl mx-auto">
      Discover amazing flights, compare prices from hundreds of airlines, 
      and travel smarter with our intelligent search platform.
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-14">
      <button
        onClick={() => navigate("/")}
        className="group bg-white text-blue-700 px-10 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-2"
      >
        Start Searching
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
      </button>

      <button className="border-2 border-white/40 px-10 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">
        View Flight Deals
      </button>
    </div>

    {/* Trust badges */}
    <div className="flex flex-wrap justify-center gap-5">
      <div className="bg-white/10 px-5 py-2 rounded-lg">⭐ 4.8/5 Rating</div>
      <div className="bg-white/10 px-5 py-2 rounded-lg">✓ Best Price Guarantee</div>
      <div className="bg-white/10 px-5 py-2 rounded-lg">🔒 Secure Booking</div>
    </div>

  </div>
</section>
  );
};

export default CTASection;