import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear previous error

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: 'include', // Added for CORS credentials
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        // Handle both 'error' and 'message' properties from backend
        setError(data.error || data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSignup = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: 'include',
        body: JSON.stringify({ 
          username: newUsername, 
          password: newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully! You can now log in.");
        // Clear signup form
        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.error || data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong during signup. Please try again.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="h-screen w-screen flex m-0 p-0 overflow-hidden fixed inset-0">
      {/* Center teal section with login form */}
      <div className="flex-1 bg-gradient-to-t from-[#89ae29] to-[#2e5f52] flex items-center justify-center">
        <div className="bg-[#FEF5E3] p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto flex gap-8">
          
          {/* LEFT COLUMN */}
          <div className="w-1/2 flex-col items-center content-start text-wrap">
            <h2 className="text-3xl font-bold text-[#2e5f52] text-left">
              HELLO WORLD
            </h2>
            <p className="pt-4 text-sm text-[#2e5f52]">
              This is an Inventory Management System to track inventory, add products and manage sales history.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-1/2">
            {/* SIGN UP */}
            <div className="mb-4">
              <h3 className="text-base font-semibold text-[#2e5f52] mb-2">Create an Account</h3>
              <input
                type="text"
                placeholder="New Username"
                className="text-xs w-full mb-3 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                className="text-xs w-full mb-3 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="text-xs w-full mb-4 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleSignup}
                className="text-base w-full bg-[#2e5f52] text-white py-3 rounded shadow hover:bg-opacity-90 transition font-medium"
              >
                SIGN UP
              </button>
            </div>

            {/* LOGIN */}
            <input
              type="text"
              placeholder="Username"
              className="text-xs w-full mb-4 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="text-xs w-full mb-4 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
            <button
              onClick={handleLogin}
              className="text-base w-full bg-[#89ae29] text-white py-3 rounded shadow hover:bg-opacity-90 transition font-medium"
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;