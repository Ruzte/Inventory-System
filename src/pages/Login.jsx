import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/IMS.png';
import customIcon from '../assets/leaf.ico';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        // Store user object instead of just username string
        localStorage.setItem("user", JSON.stringify({ 
          username: username,
          password: password,
        }));
        
        // Start the zoom transition
        setIsTransitioning(true);
        
        // Navigate after the zoom effect completes
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); // 1 second for the zoom effect
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
    <div 
      className={`h-screen w-screen flex m-0 p-0 overflow-hidden fixed inset-0 transition-all duration-1000 ease-in-out transform-gpu ${
        isTransitioning 
          ? 'scale-150 opacity-0' 
          : 'scale-100 opacity-100'
      }`}
      style={{
        transformOrigin: 'center center'
      }}
    >
      {/* Center teal section with login form */}
      <div className="flex-1 bg-gradient-to-t from-[#89ae29] to-[#2e5f52] flex items-center justify-center">
        <div className="bg-[#FEF5E3] p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto flex gap-8">
          
          {/* LEFT COLUMN */}
          <div className="w-1/2 flex-col items-center content-start text-wrap">
            <div>
              <img 
                src={logo}
                alt="Logo"
                className="w-44 h-44 my-8 rounded-full shadow-md mx-auto object-cover hover:-rotate-[360deg] transition-transform duration-500"
              />
            </div>
            <div className="pt-4 text-sm text-[#2e5f52] space-y-2">
              <p className="flex items-center">
                <img src={customIcon} alt="" className="w-4 h-4 mr-3" />
                Smart inventory management made easy
              </p>
              <p className="flex items-center">
                <img src={customIcon} alt="" className="w-4 h-4 mr-3" />
                Smart inventory management made easy
              </p>
              <p className="flex items-center">
                <img src={customIcon} alt="" className="w-4 h-4 mr-3" />
                Smart inventory management made easy
              </p>
            </div>
            
            
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
                disabled={isTransitioning}
              />
              <input
                type="password"
                placeholder="New Password"
                className="text-xs w-full mb-3 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isTransitioning}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="text-xs w-full mb-4 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isTransitioning}
              />
              <button
                onClick={handleSignup}
                disabled={isTransitioning}
                className="text-base w-full bg-[#2e5f52] hover:bg-[#89ae29] text-white py-3 rounded shadow hover:bg-opacity-90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isTransitioning}
            />
            <input
              type="password"
              placeholder="Password"
              className="text-xs w-full mb-4 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isTransitioning}
            />
            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={isTransitioning}
              className={`text-base w-full text-white py-3 rounded shadow transition-all duration-300 font-medium ${
                isTransitioning 
                  ? 'bg-[#89ae29] scale-105 cursor-not-allowed opacity-75' 
                  : 'bg-[#2e5f52] hover:bg-[#89ae29] hover:bg-opacity-90'
              }`}
            >
              {isTransitioning ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;