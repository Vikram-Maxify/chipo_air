import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  FaLock,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const { trips } = useSelector((state) => state.recommendTrip);


  const handleFlightRoute = (route) => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    const departureDate = tomorrow.toISOString().split("T")[0];

    navigate(
      `/flights?from=${route.from}&to=${route.to}&departure_date=${departureDate}`,
      {
        state: {
          fromCode: route.from,
          toCode: route.to,
          departureDate,
        },
      },
    );
  };


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

popularFlights : [
  {
    label: "New York → Los Angeles",
    from: "JFK",
    to: "LAX",
  },
  {
    label: "Chicago → Miami",
    from: "ORD",
    to: "MIA",
  },
  {
    label: "San Francisco → Las Vegas",
    from: "SFO",
    to: "LAS",
  },
  {
    label: "Boston → Orlando",
    from: "BOS",
    to: "MCO",
  },
  {
    label: "Seattle → Denver",
    from: "SEA",
    to: "DEN",
  },
],

    popularHotels: [
      "Hotels in New York",
      "Hotels in Las Vegas",
      "Hotels in Miami",
      "Hotels in Orlando",
      "Hotels in San Francisco",
    ],
  };

  return (
    <footer className="bg-[#0B1220] text-white">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2276FF] flex items-center justify-center">
                <FaPlane className="text-white text-lg -rotate-45" />
              </div>

              <div>
                <h2 className="text-2xl font-black">FlightBooker</h2>

                <p className="text-sm text-gray-400">
                  Flights • Hotels • Packages
                </p>
              </div>
            </Link>

            <p className="text-gray-400 leading-8 max-w-md mb-8">
              Discover the best flight deals, luxury hotels, and unforgettable
              holiday packages at amazing prices with secure and hassle-free
              booking.
            </p>

            {/* CONTACT */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <FaPhoneAlt className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Customer Support</p>

                  <p className="font-semibold">+1 800-123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <FaEnvelope className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email Support</p>

                  <p className="font-semibold">support@flightbooker.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Office</p>

                  <p className="font-semibold">New York, USA</p>
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-xl font-bold mb-6">Company</h3>

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
            <h3 className="text-xl font-bold mb-6">Support</h3>

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
            <h3 className="text-xl font-bold mb-6">Services</h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <FaPlane className="text-[#2276FF]" />
                </div>

                <div>
                  <p className="font-semibold">Flight Booking</p>

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
                  <p className="font-semibold">Hotel Booking</p>

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
                  <p className="font-semibold">Holiday Packages</p>

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
            <h3 className="text-2xl font-bold mb-6">Popular Flight Routes</h3>

            <div className="flex flex-wrap gap-3">
              {footerData.popularFlights.map((route) => (
                <button
                  key={route.label}
                  onClick={() => handleFlightRoute(route)}
                  className="bg-white/5 hover:bg-[#2276FF] px-4 py-2 rounded-full text-sm transition-all"
                >
                  {route.label}
                </button>
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
                Subscribe for exclusive flight offers and holiday package
                discounts.
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

        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {/* Visa */}
          <div className="rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <svg
              className="w-10 h-6"
              viewBox="0 0 48 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="30" rx="4" fill="#1434CB" />
              <path d="M29.5 10.5L27 19.5H24.5L27 10.5H29.5Z" fill="white" />
              <path d="M33 10.5L35.5 19.5H33L30.5 10.5H33Z" fill="white" />
              <path
                d="M19.5 10.5L17 13.5L16.5 12C15.5 10.5 13.5 10 12 10.5L13.5 19.5H16L18 13.5L20.5 10.5H19.5Z"
                fill="white"
              />
              <circle cx="22.5" cy="15" r="4.5" fill="#F9A825" />
            </svg>
            <span className="text-white font-semibold text-sm">Visa</span>
          </div>

          {/* Mastercard */}
          <div className="rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <svg
              className="w-10 h-6"
              viewBox="0 0 48 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="30" rx="4" fill="white" />
              <circle cx="19" cy="15" r="7" fill="#EB001B" />
              <circle cx="29" cy="15" r="7" fill="#F79E1B" />
              <path
                d="M24 10C22.5 11.5 21.5 13 21.5 15C21.5 17 22.5 18.5 24 20C25.5 18.5 26.5 17 26.5 15C26.5 13 25.5 11.5 24 10Z"
                fill="#FF5F00"
              />
            </svg>
            <span className="text-white font-semibold text-sm">Mastercard</span>
          </div>

          {/* American Express */}
          <div className="rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <svg
              className="w-10 h-6"
              viewBox="0 0 48 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="30" rx="4" fill="#006FCF" />
              <rect x="8" y="10" width="32" height="10" fill="white" />
              <path d="M12 13H36V17H12V13Z" fill="#006FCF" />
              <path d="M15 14H33V16H15V14Z" fill="white" />
            </svg>
            <span className="text-white font-semibold text-sm">Amex</span>
          </div>

          {/* PayPal */}
          <div className="rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <svg
              className="w-10 h-6"
              viewBox="0 0 48 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="30" rx="4" fill="#003087" />
              <path
                d="M15 10H25C27.5 10 29 11.5 29 14C29 16.5 27.5 18 25 18H20L19 22H16L17.5 14H15V10Z"
                fill="#009CDE"
              />
              <path
                d="M20 14H23C24 14 24.5 14.5 24.5 15.5C24.5 16.5 24 17 23 17H21L20.5 19H18L19 14H20Z"
                fill="#012169"
              />
            </svg>
            <span className="text-white font-semibold text-sm">PayPal</span>
          </div>

          {/* Rupay */}
          <div className="rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <svg
              className="w-10 h-6"
              viewBox="0 0 48 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="30" rx="4" fill="#0A4A7A" />
              <path d="M12 12H20L18 22H15L16 12H12V12Z" fill="#FF9933" />
              <circle cx="28" cy="15" r="4" fill="white" />
              <path d="M30 12H36L34 22H31L32 12H30Z" fill="white" />
            </svg>
            <span className="text-white font-semibold text-sm">RuPay</span>
          </div>

          {/* Discover */}
          <div className="rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <svg
              className="w-10 h-6"
              viewBox="0 0 48 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="30" rx="4" fill="#FF6600" />
              <circle cx="24" cy="15" r="6" fill="white" />
              <path d="M30 12H36V18H30V12Z" fill="white" />
            </svg>
            <span className="text-white font-semibold text-sm">Discover</span>
          </div>

          {/* Apple Pay */}
          <div className="rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <svg
              className="w-10 h-6"
              viewBox="0 0 48 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="30" rx="4" fill="black" />
              <path
                d="M18 12C16.5 12 15 13 15 15C15 17 16.5 18 18 18C19.5 18 21 17 21 15C21 13 19.5 12 18 12Z"
                fill="white"
              />
              <path
                d="M30 12C28.5 12 27 13 27 15C27 17 28.5 18 30 18C31.5 18 33 17 33 15C33 13 31.5 12 30 12Z"
                fill="white"
              />
              <rect x="22" y="10" width="4" height="10" fill="white" />
            </svg>
            <span className="text-white font-semibold text-sm">Apple Pay</span>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="pt-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* SOCIAL */}
          <div className="flex items-center gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map(
              (Icon, index) => (
                <a
                  key={index}
                  href="/"
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-[#2276FF] flex items-center justify-center transition-all"
                >
                  <Icon />
                </a>
              ),
            )}
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