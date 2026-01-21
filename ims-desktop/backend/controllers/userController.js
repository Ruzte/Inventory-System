import crypto from 'crypto';
import bcrypt from 'bcrypt'; 
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';

// Email verification function
export const sendEmailVerification = async (req, res) => {
  const { username, email } = req.body;

  try {
    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    const existingEmailUser = await User.findOne({ 
      email: email.toLowerCase().trim(),
      username: { $ne: username }
    });
    
    if (existingEmailUser) {
      return res.status(409).json({ error: 'This email is already linked to another account' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with email and verification token
    user.email = email.toLowerCase().trim();
    user.emailVerified = false;
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpiry = verificationExpiry;
    await user.save();

    // Create verification link
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
    
    // Send verification email
    await sendEmail(
      email,
      'Verify Your Email - Inventory System',
      `Hello ${user.username},\n\nThank you for linking your email address to your Inventory System account.\n\nTo complete the setup and enable password recovery, please verify your email by clicking this link:\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nOnce verified, you'll be able to:\n• Reset your password using this email\n• Receive important account notifications\n\nIf you didn't link this email, please ignore this message.\n\nBest regards,\nInventory System Team`
    );

    console.log("✅ Email verification sent to:", email);
    res.status(200).json({ 
      message: 'Verification email sent! Please check your inbox and click the verification link.',
      emailSent: true
    });

  } catch (err) {
    console.error('❌ Email verification error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

// Verify email function
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  try {
    // Find user with valid verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Mark email as verified and clear verification token
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await user.save();

    console.log("✅ Email verified for user:", user.username);
    res.status(200).json({ 
      message: 'Email verified successfully! You can now use this email for password recovery.',
      user: {
        username: user.username,
        businessName: user.businessName,
        email: user.email,
        emailVerified: user.emailVerified
      }
    });

  } catch (err) {
    console.error('❌ Email verification error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

// Enhanced forgot password - only works with verified emails
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Always return same message for security (don't reveal if user exists)
    const successMessage = 'If an account with that verified email exists, we have sent a password reset link.';
    
    if (!user || !user.email || !user.emailVerified) {
      return res.status(200).json({ message: successMessage });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create reset link
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    // Send email
    await sendEmail(
      email,
      'Password Reset Request - Inventory System',
      `Hello ${user.username},\n\nYou requested a password reset for your Inventory System account.\n\nClick this link to reset your password:\n${resetLink}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nInventory System Team`
    );

    console.log("✅ Password reset email sent to:", email);
    res.status(200).json({ message: successMessage });

  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    console.log("✅ Password reset successful for user:", user.username);
    res.status(200).json({ message: 'Password reset successfully! You can now login with your new password.' });

  } catch (err) {
    console.error('❌ Reset password error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};