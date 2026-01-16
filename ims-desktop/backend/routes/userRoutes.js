import express from 'express';
import bcrypt from 'bcrypt';
import { forgotPassword, resetPassword, sendEmailVerification, verifyEmail } from '../controllers/userController.js';
import User from '../models/user.js';

const router = express.Router();

// Email verification routes
router.post('/send-email-verification', sendEmailVerification);
router.post('/verify-email', verifyEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

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
      email: undefined, // Default empty email
      emailVerified: false // Default unverified
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

    // Return user data including business name, email, and verification status
    res.status(200).json({ 
      message: 'Login successful.',
      user: {
        username: user.username,
        businessName: user.businessName || user.username,
        email: user.email || '',
        emailVerified: user.emailVerified || false
      }
    });

  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Enhanced profile route - now handles email verification
router.put('/profile', async (req, res) => {
  const { username, businessName, email } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Build update object
    const updateData = {
      businessName: businessName || ''
    };
    
    // Handle email updates
    if (email && email.trim() !== '') {
      const trimmedEmail = email.trim().toLowerCase();
      
      // Check if email is already taken by another user
      const existingEmailUser = await User.findOne({ 
        email: trimmedEmail,
        username: { $ne: username }
      });
      
      if (existingEmailUser) {
        return res.status(409).json({ error: 'This email is already linked to another account' });
      }

      // If email changed, reset verification status
      if (user.email !== trimmedEmail) {
        updateData.email = trimmedEmail;
        updateData.emailVerified = false;
        updateData.emailVerificationToken = null;
        updateData.emailVerificationExpiry = null;
      }
    } else {
      // If email is being removed
      if (user.email) {
        updateData.email = null;
        updateData.emailVerified = false;
        updateData.emailVerificationToken = null;
        updateData.emailVerificationExpiry = null;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      updateData,
      { new: true }
    );

    res.status(200).json({ 
      message: 'Profile updated successfully.',
      user: {
        username: updatedUser.username,
        businessName: updatedUser.businessName,
        email: updatedUser.email || '',
        emailVerified: updatedUser.emailVerified || false
      },
      emailChanged: updateData.email !== undefined
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

export default router;