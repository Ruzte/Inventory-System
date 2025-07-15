import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { HiOutlineEye } from "react-icons/hi";
import { useCurrency } from "../context/Currency";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { currency, setCurrency } = useCurrency();
  const { photo, setPhoto } = useUser();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ User updated successfully.");
        localStorage.setItem("username", username); 
        setEditing(false);
      } else {
        setMessage("❌ " + (data.error || "Update failed."));
      }
    } catch (err) {
      console.error("❌ Update failed", err);
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <div className="bg-[#FEF5E3] rounded-xl shadow-lg w-full max-w-6xl p-8 flex gap-8">
      {/* LEFT: Profile Picture */}
      <div className="flex flex-col items-center w-1/3">
        <label htmlFor="photo-upload" className="cursor-pointer">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow"
            />
          ) : (
            <div className="bg-[#2e5f52] text-white w-48 h-48 rounded-full flex items-center justify-center text-3xl font-light mb-2">
              <span className="text-center text-sm">+ Add Photo</span>
            </div>
          )}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* CENTER: Form */}
      <div className="w-1/2 flex flex-col gap-4">
        {/* Username */}
        <label className="text-sm font-semibold text-gray-700">Username</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="w-full p-2 pl-3 rounded-md bg-[#E4DED0] text-gray-700 shadow-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!editing}
          />
          <FiEdit3
            className="text-[#7a9c32] cursor-pointer"
            onClick={() => setEditing(true)}
          />
        </div>

        {/* Password */}
        <label className="text-sm font-semibold text-gray-700">Password</label>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 pl-3 pr-10 rounded-md bg-[#E4DED0] text-gray-700 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!editing}
            />
            <HiOutlineEye
              className="absolute right-3 top-2.5 text-[#7a9c32] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <FiEdit3
            className="text-[#7a9c32] cursor-pointer"
            onClick={() => setEditing(true)}
          />
        </div>

        {/* Currency Preference */}
        <label className="text-sm font-semibold text-gray-700">Currency Preference</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 rounded-md bg-[#f9f3d9] shadow-sm text-gray-700"
        >
          <option value="AED">AED</option>
          <option value="USD">USD</option>
          <option value="PHP">PHP</option>
        </select>

        {/* Status Message */}
        {message && (
          <p className={`text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        {/* Buttons */}
        {editing && (
          <div className="flex gap-4 mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#2e5f52] text-white px-4 py-2 rounded shadow hover:bg-green-800 transition"
              onClick={handleUpdate}
            >
              Confirm
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Log Out */}
      <div className="w-1/6 flex items-start justify-center pt-2">
        <button
          onClick={handleLogout}
          className="bg-[#2e5f52] text-white px-6 py-2 rounded shadow hover:scale-105 transition-transform"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
