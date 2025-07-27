import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/IMS.png'; 
import Profile from '../assets/profile.png'; 
import ProfileModal from "../components/ProfileModal";

function Topbar() {
  
  const [username, setUsername] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUsername(storedUser.username || '');
      setBusinessName(storedUser.businessName || storedUser.username || '');
    }
  }, []);

  // Function to update profile data in both state and localStorage
  const updateProfile = (userData) => {
    setBusinessName(userData.businessName || userData.username || '');
    
    // Update localStorage with new profile data
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = {
      ...storedUser,
      businessName: userData.businessName,
      email: userData.email
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 🔓 Logout logic from your Profile page
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user'); // Also remove user data
    navigate('/');
  };

  // 🧠 Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // 🚫 Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-wrapper')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#89ae29] text-white px-6 py-3 mx-4 mt-4 rounded-full shadow-lg flex justify-between items-center">

      {/* 🔷 Left side: Logo + Business Name */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 object-cover rounded-full shadow cursor-pointer hover:scale-105 hover:-rotate-[360deg] transition-transform duration-500  "
          />
        </Link>
        <span className="text-xl text-[#FEF5E3] font-bold">{businessName || "BUSINESS NAME"}</span>
      </div>

      {/* 🔗 Navigation */}
      <div className="flex items-center gap-6">
        <div className="space-x-6 text-sm">
          <Link to="/dashboard" className="inline-block text-white hover:scale-105 transition-transform duration-200">
            Dashboard
          </Link>
          <Link to="/inventory" className="inline-block text-white hover:scale-105 transition-transform duration-200">
            Inventory
          </Link>
          <Link to="/history" className="inline-block text-white hover:scale-105 transition-transform duration-200">
            History
          </Link>
        </div>

        {/* 👤 Profile Image Dropdown */}
        <div className="relative dropdown-wrapper">
          <button
            onClick={toggleDropdown}
            className="w-8 h-8 rounded-full bg-[#2f5d55] flex items-center justify-center shadow transition-all duration-200 hover:shadow-lg"
          >
            <img 
              src={Profile} 
              alt="Logo" 
              className="w-8 h-8 object-contain rounded-full shadow-md hover:scale-105 hover:-rotate-[360deg] transition-transform duration-500"
            />
          </button>

          {/* 📋 Dropdown menu with smooth transitions */}
          <div 
            className={`absolute right-0 mt-2 w-32 bg-white text-black rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-out origin-top-right ${
              dropdownOpen 
                ? 'opacity-100 scale-100 translate-y-0 visible' 
                : 'opacity-0 scale-95 -translate-y-2 invisible'
            }`}
          >
            <button
              onClick={() => setShowProfileModal(true)}
              className=" w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150 text-sm flex items-center"
            >
              <span className="mr-2">👤</span>
              Edit Profile
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleLogout}
              className=" w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 text-sm flex items-center"
            >
              <span className="mr-2">🚪</span>
              Logout
            </button>
          </div>

          {/* ProfileModal - render outside dropdown to avoid z-index issues */}
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            currentUsername={username}
            onProfileUpdate={updateProfile}
          />
        </div>
      </div>
    </div>
  );
}

export default Topbar;