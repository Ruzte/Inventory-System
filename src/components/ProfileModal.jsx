import { useState, useEffect } from 'react';

function ProfileModal({ isOpen, onClose, currentUsername, onProfileUpdate }) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Load current user data when modal opens
  useEffect(() => {
    if (isOpen) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setBusinessName(storedUser.businessName || currentUsername || '');
      setEmail(storedUser.email || '');
      setEmailVerified(storedUser.emailVerified || false);
      setError('');
      setSuccess('');
      setVerificationSent(false);
    }
  }, [isOpen, currentUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUsername,
          businessName: businessName.trim(),
          email: email.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new profile data
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...storedUser,
          businessName: data.user.businessName,
          email: data.user.email,
          emailVerified: data.user.emailVerified
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update local state
        setEmailVerified(data.user.emailVerified);

        // If email was changed and user provided an email, offer to send verification
        if (data.emailChanged && email.trim()) {
          setSuccess('Profile updated! Click "Send Verification" to verify your email for password recovery.');
        } else {
          setSuccess('Profile updated successfully!');
          
          // Close modal after 2 seconds if no verification needed
          setTimeout(() => {
            onClose();
          }, 2000);
        }

        // Call the parent callback to update the topbar
        if (onProfileUpdate) {
          onProfileUpdate(data.user);
        }
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!email.trim()) {
      setError('Please enter an email address first');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/send-email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUsername,
          email: email.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Verification email sent! Please check your inbox and click the verification link.');
        setVerificationSent(true);
        
        // Update localStorage to reflect the unverified email
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...storedUser,
          email: email.trim(),
          emailVerified: false
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setEmailVerified(false);
        
        if (onProfileUpdate) {
          onProfileUpdate({
            ...storedUser,
            email: email.trim(),
            emailVerified: false
          });
        }
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      console.error('Email verification error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2e5f52]">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Business Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#2e5f52] mb-2">
              Business Name (Optional)
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#89ae29] bg-[#FEF5E3] text-[#2e5f52]"
              placeholder="Enter your business name"
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1">
              This will be displayed in the top bar
            </p>
          </div>

          {/* Email Field with Verification Status */}
          <div>
            <label className="block text-sm font-medium text-[#2e5f52] mb-2">
              Link Gmail/Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#89ae29] bg-[#FEF5E3] text-[#2e5f52]"
                placeholder="Enter your Gmail or email address"
                disabled={loading}
              />
              {email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailVerified ? (
                    <span className="text-green-600 text-sm">✓ Verified</span>
                  ) : (
                    <span className="text-orange-600 text-sm">⚠ Unverified</span>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-600 mt-1 space-y-1">
              <p>• Works with Gmail, Yahoo, Outlook, and other email providers</p>
              <p>• Used for secure password recovery</p>
              {email && !emailVerified && (
                <p className="text-orange-600">• Email must be verified to enable password recovery</p>
              )}
            </div>
          </div>

          {/* Email Verification Section */}
          {email && !emailVerified && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-800 font-medium">Email Verification Required</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Verify your email to enable password recovery
                  </p>
                </div>
                <button
                  onClick={handleSendVerification}
                  className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors disabled:opacity-50"
                  disabled={loading || verificationSent}
                >
                  {verificationSent ? 'Sent!' : 'Send Verification'}
                </button>
              </div>
            </div>
          )}

          {/* Verified Email Success */}
          {email && emailVerified && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <div>
                  <p className="text-sm text-green-800 font-medium">Email Verified</p>
                  <p className="text-xs text-green-600">Password recovery is enabled</p>
                </div>
              </div>
            </div>
          )}

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
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-[#2e5f52] text-white rounded-md hover:bg-[#89ae29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;