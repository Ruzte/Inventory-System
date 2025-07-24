import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { HiOutlineEye } from "react-icons/hi";

const ProfileModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState(storedUser?.username || "");
    const [password, setPassword] = useState(storedUser?.password || "");

 

  const handleUpdate = async () => {
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-[#2e5f52]">Change Username or Password</h2>

        {/* Username */}
        <label className="text-sm font-semibold text-gray-700">Username</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            className="w-full p-2 pl-3 rounded-md bg-[#E4DED0] text-gray-700 shadow-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!editing}
          />
          <FaUserEdit
            className="text-[#7a9c32] cursor-pointer"
            onClick={() => setEditing(true)}
          />
        </div>

        {/* Password */}
        <label className="text-sm font-semibold text-gray-700">Password</label>
        <div className="flex items-center gap-2 mb-4">
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
          <FaUserEdit
            className="text-[#7a9c32] cursor-pointer"
            onClick={() => setEditing(true)}
          />
        </div>

        {/* Status Message */}
        {message && (
          <p
            className={`text-sm mb-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Buttons */}
        {editing && (
          <div className="flex justify-end gap-4">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#89AE29] text-white px-4 py-2 rounded shadow hover:bg-[#2e5f52] transition"
              onClick={handleUpdate}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
