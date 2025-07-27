import { useState, useEffect } from 'react';

function ProfileModal({ isOpen, onClose, currentUsername, onProfileUpdate }) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load current user data when modal opens
  useEffect(() => {
    if (isOpen) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setBusinessName(storedUser.businessName || currentUsername || '');
      setEmail(storedUser.email || '');
      setError('');
      setSuccess('');
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
        setSuccess('Profile updated successfully!');
        
        // Update localStorage with new profile data
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...storedUser,
          businessName: data.user.businessName,
          email: data.user.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Call the parent callback to update the topbar
        if (onProfileUpdate) {
          onProfileUpdate(data.user);
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
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
              placeholder="Enter your business name "
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1">
              This will be displayed in the top bar
            </p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#2e5f52] mb-2">
              Link Email Address 
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#89ae29] bg-[#FEF5E3] text-[#2e5f52]"
              placeholder="Enter your email address "
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1">
              Used for password recovery
            </p>
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