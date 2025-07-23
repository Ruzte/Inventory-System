import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function Topbar() {
  const { photo } = useUser(); // get photo from context
  const [username, setUsername] = useState("");

  // Fetch username from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="bg-gradient-to-r  from-[#2e5f52] to-[#89ae29] text-white px-6 py-3 mx-4 mt-4 rounded-full shadow-lg flex justify-between items-center">
      
      {/* Profile + Username */}
      <div className="flex items-center gap-3">
        {photo ? (
          <img
            src={photo}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#2f5d55] flex items-center justify-center shadow">
            <FaUser className="text-white text-sm" />
          </div>
        )}
        <span className="text-xl font-bold">{username || "USERNAME"}</span>
      </div>

      {/* Navigation */}
      <div className="space-x-6 text-sm">
        <Link
          to="/dashboard"
          className="inline-block text-white hover:scale-105 transition-transform duration-200"
        >
          Dashboard
        </Link>
        <Link
          to="/inventory"
          className="inline-block text-white hover:scale-105 transition-transform duration-200"
        >
          Inventory
        </Link>
        <Link
          to="/history"
          className="inline-block text-white hover:scale-105 transition-transform duration-200"
        >
          History
        </Link>
        <Link
          to="/profile"
          className="inline-block text-white hover:scale-105 transition-transform duration-200"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
