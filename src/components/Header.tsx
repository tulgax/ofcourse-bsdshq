import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, BookOpen, LogOut, LogIn, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/auth';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isInstructorView = location.pathname.startsWith('/instructor');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSwitchView = (path: string) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/ofcourse-ab402.appspot.com/o/ofcourse%20logo.svg?alt=media&token=84dbb24b-3914-42ac-827b-4f1ce9f762ce" 
            alt="OfCourse Logo" 
            className="h-4 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          {!isInstructorView && (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <nav>
                <ul className="flex space-x-4">
                  <li><Link to="/courses" className="text-gray-600 hover:text-primary-500">Courses</Link></li>
                  {user && <li><Link to="/student/dashboard" className="text-gray-600 hover:text-primary-500">Dashboard</Link></li>}
                </ul>
              </nav>
            </>
          )}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 focus:outline-none"
              >
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.displayName || 'User'}</span>
                  <span className="text-xs text-gray-500">{isInstructorView ? 'Instructor' : 'Student'}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 focus:outline-none"
              >
                <LogIn size={24} />
                <span>Login</span>
              </button>
            )}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                {user ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User size={18} className="mr-2" />
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings size={18} className="mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={() => handleSwitchView(isInstructorView ? "/student/dashboard" : "/instructor/dashboard")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <BookOpen size={18} className="mr-2" />
                      Switch to {isInstructorView ? "Student" : "Instructor"}
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <LogIn size={18} className="mr-2" />
                      Login
                    </Link>
                    <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User size={18} className="mr-2" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-primary-500 focus:outline-none">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4">
          {!isInstructorView && (
            <>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <nav className="mb-4">
                <ul className="space-y-2">
                  <li><Link to="/courses" className="block text-gray-600 hover:text-primary-500">Courses</Link></li>
                  {user && <li><Link to="/student/dashboard" className="block text-gray-600 hover:text-primary-500">Dashboard</Link></li>}
                </ul>
              </nav>
            </>
          )}
          {user ? (
            <>
              <Link to="/profile" className="block py-2 text-gray-600 hover:text-primary-500">Profile</Link>
              <Link to="/settings" className="block py-2 text-gray-600 hover:text-primary-500">Settings</Link>
              <button 
                onClick={() => handleSwitchView(isInstructorView ? "/student/dashboard" : "/instructor/dashboard")}
                className="block w-full text-left py-2 text-gray-600 hover:text-primary-500"
              >
                Switch to {isInstructorView ? "Student" : "Instructor"}
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-gray-600 hover:text-primary-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-gray-600 hover:text-primary-500">Login</Link>
              <Link to="/register" className="block py-2 text-gray-600 hover:text-primary-500">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;