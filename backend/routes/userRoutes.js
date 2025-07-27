import express from 'express';
import bcrypt from 'bcrypt';
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
      email: '' // Default empty email
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

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { 
        businessName: businessName || '',
        email: email || ''
      },
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
        email: updatedUser.email
      }
    });

  } catch (err) {
    console.error("❌ Profile update failed", err);
    res.status(500).json({ error: 'Profile update failed.' });
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