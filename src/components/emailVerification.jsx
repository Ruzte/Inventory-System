import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import logo from '../assets/IMS.png';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  // Countdown and redirect for success
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/login');
    }
  }, [status, countdown, navigate]);

  const verifyEmail = async (token) => {
    try {
      const data = await window.api.verifyEmail(token);

      setStatus('success');
      setMessage(data.message);

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.username === data.user?.username) {
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          email: data.user.email,
          emailVerified: data.user.emailVerified
        }));
      }

    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage(error.message || 'Email verification failed.');
    }
  };


  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen flex m-0 p-0 overflow-hidden fixed inset-0 bg-gradient-to-t from-[#89ae29] to-[#2e5f52]">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-[#FEF5E3] p-8 rounded-lg shadow-md w-full max-w-md mx-4">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={logo}
              alt="Logo"
              className="w-24 h-24 mx-auto rounded-full shadow-md object-cover"
            />
            <h1 className="text-2xl font-bold text-[#2e5f52] mt-4">
              Email Verification
            </h1>
          </div>

          {/* Verification Status */}
          <div className="text-center">
            {status === 'verifying' && (
              <div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e5f52] mx-auto mb-4"></div>
                <p className="text-[#2e5f52]">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h2 className="text-xl font-semibold text-[#2e5f52] mb-4">
                  Email Verified Successfully!
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <p className="text-green-800 text-sm">{message}</p>
                  <p className="text-green-600 text-xs mt-2">
                    You can now use password recovery with this email address.
                  </p>
                </div>
                <p className="text-[#2e5f52] text-sm mb-4">
                  Redirecting to login page in {countdown} seconds...
                </p>
                <button
                  onClick={handleReturnToLogin}
                  className="w-full bg-[#2e5f52] hover:bg-[#89ae29] text-white py-2 px-4 rounded transition-colors"
                >
                  Return to Login
                </button>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div className="text-red-600 text-6xl mb-4">✗</div>
                <h2 className="text-xl font-semibold text-[#2e5f52] mb-4">
                  Verification Failed
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-red-800 text-sm">{message}</p>
                  <p className="text-red-600 text-xs mt-2">
                    The verification link may have expired or been used already.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleReturnToLogin}
                    className="w-full bg-[#2e5f52] hover:bg-[#89ae29] text-white py-2 px-4 rounded transition-colors"
                  >
                    Return to Login
                  </button>
                  <p className="text-xs text-gray-600">
                    You can request a new verification email from your profile settings.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;