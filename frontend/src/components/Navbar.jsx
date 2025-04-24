import React, { useContext, useState } from "react";
import { Menu, X, MapPinHouse } from "lucide-react";
import { NavLink } from "react-router-dom";
import ProfileDropdown from "./ToggleMenu";
// import { AuthContext } from "../auth";
import { userAuthentication } from "../auth/auth";

function Navbar() {
  const { isAuthorized } = userAuthentication();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-4 bg-white shadow-lg">
        <div>
          <NavLink
            to="/"
            className="flex items-center group transition-transform duration-300 hover:scale-105"
          >
            <MapPinHouse className="w-10 h-9 max-lg:h-9 max-md:h-8 text-indigo-600 md:w-12 lg:w-14 transition-colors duration-300 group-hover:text-indigo-700" />
            <p className="text-lg md:text-[1.5rem] font-bold text-indigo-600 transition-colors duration-300 group-hover:text-indigo-700">
              localConnecto
            </p>
          </NavLink>
        </div>

        <div className="hidden md:flex ml-10 items-center  space-x-4 lg:space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-base font-medium transition-colors hover:text-indigo-600 ${
                isActive
                  ? "text-indigo-700 bg-indigo-100 px-2 py-1 rounded-sm"
                  : "text-gray-600"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/listings"
            className={({ isActive }) =>
              `text-base font-medium transition-colors hover:text-indigo-600 ${
                isActive
                  ? "text-indigo-700 bg-indigo-100 px-2 py-1 rounded-sm"
                  : "text-gray-600"
              }`
            }
          >
            Listed Items
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-base font-medium transition-colors hover:text-indigo-600 ${
                isActive
                  ? "text-indigo-700 bg-indigo-100 px-2 py-1 rounded-sm"
                  : "text-gray-600"
              }`
            }
          >
            About
          </NavLink>
        </div>

        <div className="flex space-x-2 md:space-x-8 items-center">
          {/* <Heart className="hidden md:block cursor-pointer" />
          <ShoppingBasket className="hidden md:block cursor-pointer" /> */}
          {isAuthorized && <ProfileDropdown />}

          {!isAuthorized && !menuOpen && (
            <>
              <NavLink to="/login">
                <Button
                  className="border-2 text-sm border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                  btnName={"Log in"}
                />
              </NavLink>
              <NavLink to="/signup">
                <Button
                  className="bg-indigo-700 text-white text-sm hover:bg-indigo-600"
                  btnName={"Sign up"}
                />
              </NavLink>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden  p-2 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 px-4 py-6 bg-white">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:bg-indigo-50 py-2 px-4 rounded ${
                  isActive ? "text-indigo-700 bg-indigo-100" : "text-gray-600"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/listed_items"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:bg-indigo-50  py-2 px-4 rounded ${
                  isActive ? "text-indigo-700 bg-indigo-100" : "text-gray-600"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Listed Items
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:bg-indigo-50  py-2 px-4 rounded ${
                  isActive ? "text-indigo-700 bg-indigo-100" : "text-gray-600"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              About
            </NavLink>
          </div>
          {!isAuthorized && (
            <div className="flex flex-row space-x-3 pt-4 border-t justify-center pb-4">
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`w-2/5  text-left py-2 px-4 rounded-md font-semibold text-indigo-600 border-1 hover:bg-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2}`}
              >
                <button className="w-full">Sign In</button>
              </NavLink>

              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className={`w-2/5 text-left py-2 px-4 rounded-md font-semibold bg-indigo-700 text-white hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <button className="w-full">Sign Up</button>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;

function Button({ className, btnName }) {
  return (
    <button
      className={`px-2 py-1 font-bold lg:py-2 lg:px-3 rounded-[0.5rem] ${className}`}
    >
      {btnName}
    </button>
  );
}

{
  /* <div className="hidden md:flex justify-center w-1/3 relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 text-gray-500" />
          <input
            type="search"
            className="border border-gray-400 rounded-2xl py-1 pl-10 pr-4 w-full focus:outline-none focus:border-gray-500"
            placeholder="Search for anything"
          />
        </div> */
}
