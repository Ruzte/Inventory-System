import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { HiOutlineEye } from "react-icons/hi";
import { useCurrency } from "../context/Currency";

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { currency, setCurrency } = useCurrency();

  return (
      <div className="bg-[#FEF5E3] rounded-xl shadow-lg w-full max-w-6xl p-8 flex gap-8">
        
        {/* LEFT: Profile Picture */}
        <div className="flex flex-col items-center w-1/3">
          <div className="bg-[#2e5f52] text-white w-48 h-48 rounded-full flex items-center justify-center text-3xl font-light mb-2">
            <span className="text-center">+ Add Photo</span>
          </div>
        </div>

        {/* CENTER: Form */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Username */}
          <label className="text-sm font-semibold text-gray-700">Username</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full p-2 pl-3 rounded-md bg-[#E4DED0] text-gray-700 shadow-sm"
              defaultValue=""
            />
            <FiEdit3 className="text-[#7a9c32] cursor-pointer" />
          </div>


          {/* Password */}
          <label className="text-sm font-semibold text-gray-700">Password</label>
          <div className="flex items-center gap-2">
          {/* Container with relative positioning */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 pl-3 pr-10 rounded-md bg-[#E4DED0] text-gray-700 shadow-sm"
            />
            {/* Eye icon inside the input */}
            <HiOutlineEye
              className="absolute right-3 top-2.5 text-[#7a9c32] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
            {/* Edit icon outside the input */}
            <FiEdit3 className="text-[#7a9c32] cursor-pointer" />
          </div>

          <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="w-full p-2 rounded-md bg-[#f9f3d9] shadow-sm text-gray-700"
      
    
    >
      <option value="USD">USD</option>
      <option value="PHP">PHP</option>
      <option value="EUR">EUR</option>
    </select>

          {/* Currency Dropdown */}
          <label className="text-sm font-semibold text-gray-700">Currency Preference</label>
      
          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
              Cancel
            </button>
            <button className="bg-[#2e5f52] text-white px-4 py-2 rounded shadow hover:bg-green-800 transition">
              Confirm
            </button>
          </div>
        </div>

        {/* RIGHT: Log Out */}
        <div className="w-1/6 flex items-start justify-center pt-2">
          <button className="bg-[#2e5f52] text-white px-6 py-2 rounded shadow hover:scale-105 transition-transform">
            Log Out
          </button>
        </div>
      </div>
   
  );
};

export default Profile;
