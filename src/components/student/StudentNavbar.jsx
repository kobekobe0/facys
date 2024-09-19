import React, { useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/user.store";
import Loading from "../Loading";

const StudentNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {user, fetchUser, loading, error, logout} = useUserStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if(loading) return <Loading />

  return (
    <nav className="bg-red-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left side: Logo and Name */}
          <Link to='/' className="flex items-center">
            <div className="text-green-500 text-2xl font-bold mr-2">🌿</div>
            <span className="text-xl font-semibold">F</span>
          </Link>
          <div className="hidden md:flex space-x-4 items-center">
            <div className="hidden md:flex space-x-4">
                <a href="#home" className="text-white hover:text-green-500">
                    Home
                </a>
                <a href="#about" className="text-white hover:text-green-500">
                    About
                </a>
                <a href="#features" className="text-white hover:text-green-500">
                    Features
                </a>
            </div>
            <button className="bg-red-950 text-white px-4 py-1 rounded hover:text-red-500" onClick={logout}>
              Logout
            </button>
          </div>
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
        className={`md:hidden fixed inset-0 bg-red-800 text-white z-50 flex flex-col items-center justify-center space-y-6 transform w-full pb-4 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <a
          href="#home"
          className="text-xl  hover:text-green-500"
          onClick={toggleMenu}
        >
          Home
        </a>
        <a
          href="#about"
          className="text-xl hover:text-green-500"
          onClick={toggleMenu}
        >
          About
        </a>
        <a
          href="#features"
          className="text-xl hover:text-green-500"
          onClick={toggleMenu}
        >
          Features
        </a>
        <Link
          className="text-xl hover:text-green-500"
          to="/signin"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-500 text-white px-6 py-2 rounded text-xl"
        >
          Sign Up
        </Link> 

      </div>
    </nav>
  );
};

export default StudentNavbar;
