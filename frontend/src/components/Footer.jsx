import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Mail,
  Phone,
  MapPinHouse,
} from "lucide-react";

function Footer() {
  return (
    <footer className="w-full border-t bg-gray-900 py-6 md:py-8 flex flex-col items-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-1.5">
              <MapPinHouse className="text-indigo-500 hover:text-indigo-400 transition-colors duration-300 h-8 w-8" />
              <span className="text-xl font-bold text-indigo-500 hover:text-indigo-400 transition-colors duration-300">
                LocalConnecto
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Connecting communities through local sharing and commerce.
            </p>
            <div className="flex space-x-4">
              <Link
                to="#"
                className="text-gray-400 hover:text-indigo-500 transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-indigo-500 transition-colors duration-300"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-indigo-500 transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Explore Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-indigo-500">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Browse Listings", to: "/listings" },
                { label: "Free Items", to: "/listings?category=free" },
                { label: "Create Listing", to: "/listings/new" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-indigo-500 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-indigo-500">Company</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Blog", to: "/blog" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-indigo-500 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-indigo-500">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400 hover:text-indigo-500 transition-colors duration-300 flex space-x-3">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">
                  Sunsari, Nepal
                </span>
              </li>
              <li className="text-gray-400 hover:text-indigo-500 transition-colors duration-300 flex space-x-3">
                <Mail className="h-5 w-5" />
                <span className="text-sm">
                localconnecto49@gmail.com
                </span>
              </li>
              <li className="text-gray-400 hover:text-indigo-500 transition-colors duration-300 flex space-x-3">
                <Phone className="h-5 w-5 " />
                <span className="text-sm">+977 9827347924</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} LocalConnecto. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
