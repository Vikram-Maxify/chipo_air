import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-6">

        <div>
          <h3 className="text-white font-semibold mb-3">
            FlightBooker
          </h3>
          <p className="text-sm">
            Book flights easily and travel smarter ✈️
          </p>
        </div>

        <div>
          <h4 className="text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <Link to="/about">About</Link>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Contact</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <Link to="/privacy">Privacy</Link>
            <li>Terms</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-sm mt-8 text-gray-500">
        © 2026 FlightBooker. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;