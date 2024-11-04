// ./src/components/StudentNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/user.store';
import logo from '../../assets/logo.png';

const StudentNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, fetchUser, loading, error, logout } = useUserStore();

    // Fetch user data on component mount
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(()=> {
      console.log(user)
    },[user])

    return (
        <nav className="bg-red-700 max-w-[600px] rounded-md text-white p-3 w-full flex justify-between items-center sticky top-0 z-50 shadow-md">
            <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                </Link>
                <span className="ml-2 text-lg font-semibold">Facys</span>
            </div>

            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="focus:outline-none md:hidden"
            >
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
                        d="M4 6h16M4 12h16M4 18h16" 
                    />
                </svg>
            </button>

            <div className="hidden md:flex items-center space-x-4">
                {loading ? (
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                ) : error ? (
                    <span>Error loading profile</span>
                ) : (
                  <Link 
                  to="/profile" 
                  className=" rounded-full w-fit px-2 transition py-2 text-gray-700 text-sm hover:bg-gray-100 flex items-center"
              >
                    <img 
                        src={user?.pfp || 'https://via.placeholder.com/40'} 
                        alt="Profile Icon" 
                        className="rounded-full w-10 h-10"
                    />
                    </Link>
                )}
                <button 
                    onClick={logout} 
                    className="text-sm font-semibold bg-white text-red-700 px-3 py-1 rounded-md"
                >
                    Logout
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-14 right-4 bg-white rounded-lg shadow-lg w-40 py-2 z-10">
                    <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 flex items-center"
                    >
                        {loading ? (
                            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                        ) : error ? (
                            <span>Error</span>
                        ) : (
                            <img 
                                src={user?.pfp || 'https://via.placeholder.com/40'} 
                                alt="Profile Icon" 
                                className="rounded-full w-6 h-6 mr-2"
                            />
                        )}
                        Profile
                    </Link>
                    <button 
                        onClick={logout} 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default StudentNavbar;
