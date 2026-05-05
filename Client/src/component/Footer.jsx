import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlane,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaArrowRight,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Privacy", to: "/privacy" },
      { label: "Blog", to: "/blog" },
      { label: "Press", to: "/press" },
    ],
    support: [
      { label: "Help Center", to: "/help" },
      { label: "Contact Us", to: "/contact" },
      { label: "FAQs", to: "/faqs" },
      { label: "Cancellation", to: "/cancellation" },
    ],
    legal: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
    quickLinks: [
      { label: "Flights", to: "/flights" },
      { label: "Packages", to: "/packages" },
      { label: "Deals", to: "/deals" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaPlane className="w-5 h-5 text-white -rotate-45" />
              </div>
              <span className="text-white font-bold text-lg">
                FlightBooker
              </span>
            </Link>

            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Book flights easily and travel smarter. Compare hundreds of airlines 
              to find the best deals for your next adventure.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-6">
              <a href="mailto:support@flightbooker.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                <FaEnvelope className="w-4 h-4" />
                support@flightbooker.com
              </a>

              <a href="tel:+911800123456" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                <FaPhone className="w-4 h-4" />
                1800-123-456
              </a>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaMapMarkerAlt className="w-4 h-4" />
                Mumbai, India
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: FaGlobe },
                { icon: FaTwitter },
                { icon: FaInstagram },
                { icon: FaYoutube },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href="#"
                    className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h4 className="text-white font-semibold">Get travel deals & offers</h4>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-white">
              Subscribe <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex justify-between flex-wrap gap-4">
          <div className="flex gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-500" />
              Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <FaCreditCard className="text-blue-500" />
              Multiple Payment Options
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Visa • Mastercard • UPI • Net Banking
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {currentYear} FlightBooker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;