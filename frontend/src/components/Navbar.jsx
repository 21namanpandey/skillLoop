import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaSearch, FaBell, FaUser, FaSignOutAlt, FaEthereum } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg"></div>
            <span className="text-xl font-bold text-primary-700">SkillLoop</span>
          </Link>

          {/* Navigation Links */}
          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <FaHome />
                <span>Dashboard</span>
              </Link>
              
              <Link to="/browse" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <FaSearch />
                <span>Browse</span>
              </Link>
              
              <Link to="/requests" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <FaBell />
                <span>Requests</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-primary-600" />
                  </div>
                  <span className="text-gray-700">{user.name}</span>
                </button>

                {showDropdown && (
                  // In the user dropdown menu, add these links:
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/sessions"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Sessions
                    </Link>
                    {/* Add these new links */}
                    <Link
                      to="/reviews"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Reviews
                    </Link>
                    <Link
                      to="/disputes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Disputes
                    </Link>
                    <li className="nav-item">
                      <Link to="/blockchain-dashboard" className="nav-link flex items-center">
                        <FaEthereum className="mr-2" />
                        Blockchain
                      </Link>
                    </li>
                    <Link
                      to="/blockchain-stats"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Blockchain Stats
                    </Link>
                    <Link
                      to="/local-explorer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Local Explorer
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;