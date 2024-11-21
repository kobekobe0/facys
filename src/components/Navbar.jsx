import React, { useState } from "react";
import { Link } from "react-router-dom";
import DETAILS from "../constants/details";
import logo from "../assets/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left side: Logo and Name */}
          <Link to='/' className="flex items-center">
            <div className="text-2xl font-bold mr-2">
              <img src={logo} alt="logo" className="w-12 h-12" />
            </div>
            <span className="text-xl font-semibold">{DETAILS.title}</span>
          </Link>

          {/* Middle: Home, About, Features (hidden on small view) */}
          <div className="hidden md:flex space-x-4">
          </div>

          {/* Right side: Login/Signup (hidden on small view) */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link className="text-gray-600 hover:text-red-950" to='/signin'>Login</Link>
            <Link className=" text-gray-600 px-4 py-1 rounded" to='/register-visitor'>
              Visitor Register
            </Link>
            <Link className="bg-red-950 text-white px-4 py-1 rounded" to='/register'>
              Register
            </Link>
          </div>

          {/* Hamburger menu button for small view */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Full-screen overlay with animation) */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-6 transform w-full pb-4 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
    
        <Link
          className="text-xl text-gray-600 hover:text-green-500"
          to="/signin"
        >
          Login
        </Link>
        <Link
          to="/register-visitor"
          className="bg-green-500 text-white px-6 py-2 rounded text-xl"
        >
          Visitor Register
        </Link> 
        <Link
          to="/register"
          className="bg-green-500 text-white px-6 py-2 rounded text-xl"
        >
          Student Register
        </Link> 

      </div>
    </nav>
  );
};

export default Navbar;
