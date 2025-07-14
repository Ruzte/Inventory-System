import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear previous error

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("loggedIn", "true");
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
      {/* Left green section */}
      <div className="flex-1 bg-[#89AE29]"></div>

      {/* Center teal section with login form */}
      <div className="flex-1 bg-[#2e5f52] flex items-center justify-center">
        <div className="bg-[#FEF5E3] p-8 rounded-lg shadow-md w-80">
          <h2 className="text-xl font-bold text-center mb-6 text-[#89AE29]">HELLO WORLD</h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="flex items-center text-sm mb-4 text-[#7a9c32]">
            <input type="checkbox" className="mr-2" /> Keep me logged in
          </label>

          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-[#2e5f52] text-white py-3 rounded shadow hover:bg-opacity-90 transition font-medium"
          >
            LOGIN
          </button>
        </div>
      </div>

      {/* Right green section */}
      <div className="flex-1 bg-[#89AE29]"></div>
    </div>
  );
}

export default Login;
