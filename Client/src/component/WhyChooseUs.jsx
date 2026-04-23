import React from "react";

const features = [
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Compare hundreds of airlines to find cheapest flights",
  },
  {
    icon: "⚡",
    title: "Fast Booking",
    desc: "Quick & seamless booking experience",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    desc: "We’re always here to help you anytime",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">

        <h2 className="text-3xl font-semibold mb-12">
          Why Choose FlightBooker?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;