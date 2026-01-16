import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, []);

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await window.api.resetPassword(token, newPassword);

      setSuccess('Password reset successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('Reset password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleResetPassword();
    }
  };

  return (
    <div className="h-screen w-screen flex m-0 p-0 overflow-hidden fixed inset-0">
      <div className="flex-1 bg-gradient-to-t from-[#89ae29] to-[#2e5f52] flex items-center justify-center">
        <div className="bg-[#FEF5E3] p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
          
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full shadow-md bg-[#89ae29] flex items-center justify-center text-white text-2xl font-bold">
              IMS
            </div>
            <h1 className="text-2xl font-bold text-[#2e5f52] mt-4">Reset Password</h1>
            <p className="text-sm text-[#2e5f52] mt-2">Enter your new password below</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2e5f52] mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none text-[#2e5f52]"
                placeholder="Enter new password"
                disabled={loading || !token}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2e5f52] mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-3 rounded bg-[#F9F3D9] shadow-sm border-none outline-none text-[#2e5f52]"
                placeholder="Confirm new password"
                disabled={loading || !token}
              />
            </div>

            {/* Status Messages */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-100 border border-green-300 text-green-700 text-sm rounded">
                {success}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleResetPassword}
                disabled={loading || !token || !newPassword || !confirmPassword}
                className="w-full bg-[#2e5f52] hover:bg-[#89ae29] text-white py-3 rounded shadow transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
              
              <button
                onClick={() => navigate('/')}
                disabled={loading}
                className="w-full border border-[#2e5f52] text-[#2e5f52] hover:bg-[#2e5f52] hover:text-white py-3 rounded transition font-medium"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;