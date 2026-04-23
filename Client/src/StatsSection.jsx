import React from "react";

const stats = [
  { number: "1M+", label: "Users" },
  { number: "500+", label: "Airlines" },
  { number: "10K+", label: "Daily Bookings" },
  { number: "99%", label: "Satisfaction" },
];

const StatsSection = () => {
  return (
    <section className="py-12 bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

        {stats.map((item, i) => (
          <div key={i}>
            <h3 className="text-2xl font-bold text-blue-600">
              {item.number}
            </h3>
            <p className="text-gray-600">{item.label}</p>
          </div>
        ))}

      </div>

    </section>
  );
};

export default StatsSection;