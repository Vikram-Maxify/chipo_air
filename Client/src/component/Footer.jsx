import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaUmbrellaBeach,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerData = {
    company: [
      "About Us",
      "Careers",
      "Investor Relations",
      "Press Releases",
      "Gift Cards",
    ],

    support: [
      "Customer Support",
      "FAQs",
      "Cancellation Policy",
      "Refund Status",
      "Travel Guidelines",
    ],

    popularFlights: [
      "Delhi to Dubai",
      "Mumbai to Bangkok",
      "Delhi to Goa",
      "Bangalore to Singapore",
      "Hyderabad to Maldives",
    ],

    popularHotels: [
      "Hotels in Goa",
      "Hotels in Dubai",
      "Hotels in Manali",
      "Hotels in Bali",
      "Hotels in Shimla",
    ],
  };

  return (
    <footer className="bg-[#0B1220] text-white">
      
      {/* TOP CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-gradient-to-r from-[#2276FF] to-[#0057D9] rounded-[32px] p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Download Our Travel App
              </h2>

              <p className="text-blue-100 text-lg leading-7 max-w-2xl">
                Book flights, hotels, and holiday packages
                faster with exclusive app-only deals and
                instant notifications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Enter mobile number"
                className="bg-white text-gray-900 px-5 py-4 rounded-2xl outline-none min-w-[260px]"
              />

              <button className="bg-[#0B1220] hover:bg-black px-7 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all">
                Get App Link

                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#2276FF] flex items-center justify-center">
                <FaPlane className="text-white text-lg -rotate-45" />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  FlightBooker
                </h2>

                <p className="text-sm text-gray-400">
                  Flights • Hotels • Packages
                </p>
              </div>
            </Link>

            <p className="text-gray-400 leading-8 max-w-md mb-8">
              Discover the best flight deals, luxury hotels,
              and unforgettable holiday packages at amazing
              prices with secure and hassle-free booking.
            </p>

            {/* CONTACT */}
            <div className="space-y-4">
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <FaPhoneAlt className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Customer Support
                  </p>

                  <p className="font-semibold">
                    +91 1800-123-456
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <FaEnvelope className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Email Support
                  </p>

                  <p className="font-semibold">
                    support@flightbooker.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Office
                  </p>

                  <p className="font-semibold">
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Company
            </h3>

            <ul className="space-y-4">
              {footerData.company.map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Support
            </h3>

            <ul className="space-y-4">
              {footerData.support.map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Services
            </h3>

            <div className="space-y-5">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <FaPlane className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="font-semibold">
                    Flight Booking
                  </p>

                  <p className="text-sm text-gray-400">
                    Domestic & International
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <FaHotel className="text-orange-400" />
                </div>

                <div>
                  <p className="font-semibold">
                    Hotel Booking
                  </p>

                  <p className="text-sm text-gray-400">
                    Luxury & Budget Hotels
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <FaUmbrellaBeach className="text-purple-400" />
                </div>

                <div>
                  <p className="font-semibold">
                    Holiday Packages
                  </p>

                  <p className="text-sm text-gray-400">
                    Family & Honeymoon Trips
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POPULAR ROUTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-14 border-b border-white/10">
          
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Popular Flight Routes
            </h3>

            <div className="flex flex-wrap gap-3">
              {footerData.popularFlights.map((item) => (
                <Link
                  key={item}
                  to="/flights"
                  className="bg-white/5 hover:bg-[#2276FF] px-4 py-2 rounded-full text-sm transition-all"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">
              Popular Hotel Destinations
            </h3>

            <div className="flex flex-wrap gap-3">
              {footerData.popularHotels.map((item) => (
                <Link
                  key={item}
                  to="/hotels"
                  className="bg-white/5 hover:bg-[#2276FF] px-4 py-2 rounded-full text-sm transition-all"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="py-14 border-b border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div>
              <h3 className="text-3xl font-black mb-3">
                Get Travel Deals & Updates
              </h3>

              <p className="text-gray-400 text-lg">
                Subscribe for exclusive flight offers and
                holiday package discounts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none min-w-[320px]"
              />

              <button className="bg-[#2276FF] hover:bg-[#0057D9] px-8 py-4 rounded-2xl font-semibold transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* SOCIAL */}
          <div className="flex items-center gap-4">
            {[
              FaFacebookF,
              FaTwitter,
              FaInstagram,
              FaYoutube,
            ].map((Icon, index) => (
              <a
                key={index}
                href="/"
                className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-[#2276FF] flex items-center justify-center transition-all"
              >
                <Icon />
              </a>
            ))}
          </div>

          {/* TRUST */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />

              Secure Payments
            </div>

            <div className="flex items-center gap-2">
              <FaCreditCard className="text-blue-400" />

              Visa • Mastercard • UPI
            </div>

            <div className="flex items-center gap-2">
              <FaHeadset className="text-orange-400" />

              24×7 Support
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="text-sm text-gray-500">
            © {currentYear} FlightBooker. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;