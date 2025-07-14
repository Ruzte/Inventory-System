// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log("🔑 Login request received:", req.body);

  const { username, password } = req.body;
  console.log("🛂 Attempt login with:", username, password);

  try {
    const user = await User.findOne({});
    console.log("🔍 Found user:", user);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match?", valid);

    if (!valid || user.username !== username) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful.' });

  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



export default router;
