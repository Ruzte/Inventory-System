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
    
    // Signup specific states
    const [signupError, setSignupError] = useState("");
    const [signupSuccess, setSignupSuccess] = useState("");
    
    // Forgot password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
    const [forgotPasswordError, setForgotPasswordError] = useState("");

    const handleLogin = async () => {
      setError("");

      try {
        const data = await window.api.login({
          username,
          password
        });

        // ONLY store what IPC actually returns
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username
          })
        );

        localStorage.setItem("loggedIn", "true");

        setIsTransitioning(true);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 800);

      } catch (error) {
        console.error("Login error:", error);
        setError(error.message || "Login failed.");
      }
    };
    
    const handleSignup = async () => {
      setSignupError("");
      setSignupSuccess("");

      if (newPassword !== confirmPassword) {
        setSignupError("Passwords do not match.");
        return;
      }

      try {
        await window.api.signup({
          username: newUsername,
          password: newPassword
        });

        setSignupSuccess("Account created successfully! You can now log in.");

        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          setSignupSuccess("");
        }, 5000);

      } catch (error) {
        console.error("Signup error:", error);
        setSignupError(error.message || "Signup failed.");
      }
    };


    const handleForgotPassword = async () => {
      setForgotPasswordError("");
      setForgotPasswordMessage("");

      if (!forgotEmail.trim()) {
        setForgotPasswordError("Please enter your email address.");
        return;
      }

      try {
        const data = await window.api.forgotPassword(forgotEmail);

        setForgotPasswordMessage(data.message || "Reset email sent.");
        setForgotEmail("");

      } catch (error) {
        console.error("Forgot password error:", error);
        setForgotPasswordError(error.message || "Failed to send reset email.");
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
              <div className="pt-4 text-sm text-[#2e5f52] space-y-2 ">
                <p className="flex items-center">
                  <img src={customIcon} alt="" className="w-4 h-4 mr-3" />
                  Smart inventory management made easy
                </p>
                <p className="flex items-center">
                  <img src={customIcon} alt="" className="w-4 h-4 mr-3" />
                  Track every item, maxmize every opportunity
                </p>
                <p className="flex items-center">
                  <img src={customIcon} alt="" className="w-4 h-4 mr-3" />
                  Know your stock, grow your business
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-1/2">
              {/* SIGN UP */}
              <div className="mb-4">
                <h3 className="text-base font-semibold text-[#2e5f52] mb-2">Create an Account</h3>
                
                {/* Signup status messages */}
                {signupError && (
                  <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 text-xs rounded">
                    {signupError}
                  </div>
                )}
                {signupSuccess && (
                  <div className="mb-3 p-2 bg-green-100 border border-green-300 text-green-700 text-xs rounded">
                    {signupSuccess}
                  </div>
                )}
                
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
              
              {/* Forgot Password Link */}
              <div className="mb-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-[#2e5f52] hover:text-[#89ae29] underline transition-colors"
                  disabled={isTransitioning}
                >
                  Forgot Password?
                </button>
              </div>
              
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

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#2e5f52]">Reset Password</h2>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail("");
                    setForgotPasswordError("");
                    setForgotPasswordMessage("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2e5f52] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#89ae29] bg-[#F9F3D9] text-[#2e5f52]"
                    placeholder="Enter your email address"
                  />
                </div>

                {forgotPasswordError && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                    {forgotPasswordError}
                  </div>
                )}
                
                {forgotPasswordMessage && (
                  <div className="p-3 bg-green-100 border border-green-300 text-green-700 text-sm rounded whitespace-pre-line">
                    {forgotPasswordMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail("");
                      setForgotPasswordError("");
                      setForgotPasswordMessage("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="flex-1 px-4 py-2 bg-[#2e5f52] text-white rounded-md hover:bg-[#89ae29] transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default Login;