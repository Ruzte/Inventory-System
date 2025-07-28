import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/user.js';

const router = express.Router();

// Add near your other routes
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user with default business name as username
    const newUser = new User({ 
      username, 
      password: hashedPassword,
      businessName: username, // Default business name to username
      email: null // Default empty email
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("❌ Error during signup:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  console.log("🔑 Login request received:", req.body);

  const { username, password } = req.body;
  console.log("🛂 Attempt login with:", username, password);

  try {
    const user = await User.findOne({username});
    console.log("🔍 Found user:", user);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match?", valid);

    if (!valid || user.username !== username) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Return user data including business name and email
    res.status(200).json({ 
      message: 'Login successful.',
      user: {
        username: user.username,
        businessName: user.businessName || user.username, // Fallback to username if no business name
        email: user.email || ''
      }
    });

  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// NEW: Update profile route (business name and email only)
router.put('/profile', async (req, res) => {
  const { username, businessName, email } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Build update object - handle empty emails by not setting them
    const updateData = {
      businessName: businessName || ''
    };
    
    // Only update email if it's provided and not empty
    if (email && email.trim() !== '') {
      updateData.email = email.trim();
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ 
      message: 'Profile updated successfully.',
      user: {
        username: updatedUser.username,
        businessName: updatedUser.businessName,
        email: updatedUser.email || ''
      }
    });

  } catch (err) {
    console.error("❌ Profile update failed", err);
    res.status(500).json({ error: 'Profile update failed: ' + err.message });
  }
});

// DEPRECATED: Old update route - keep for backward compatibility if needed
router.put('/update', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      {},
      { username, password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated successfully.' });

  } catch (err) {
    console.error("❌ Update failed", err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

// NEW: Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !user.email) {
      // Don't reveal if email exists for security
      return res.status(200).json({ 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // TODO: Send email with reset link
    // For now, we'll just log the token (you'll replace this with email service)
    console.log('Password reset token for', email, ':', resetToken);
    console.log('Reset link would be: http://localhost:3000/reset-password?token=' + resetToken);

    res.status(200).json({ 
      message: 'If an account with that email exists, we have sent a password reset link.',
      // TEMPORARY: Remove this in production - only for testing
      resetToken: resetToken
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// NEW: Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;