import React from "react";

const CTASection = () => {
  return (
    <section className="bg-blue-600 text-white py-16 text-center">

      <h2 className="text-3xl font-semibold mb-4">
        Ready to Book Your Next Trip?
      </h2>

      <p className="text-blue-100 mb-6">
        Discover flights, compare prices, and travel smarter
      </p>

      <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
        Start Searching
      </button>

    </section>
  );
};

export default CTASection;