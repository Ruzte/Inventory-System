import User from '../models/user.js';

export const getUserFromRequest = async (req, res, next) => {
  try {
    // Get username from request body, headers, or query params
    const username = req.body?.username || req.headers['x-username'] || req.query?.username;
    
    console.log('Auth middleware - Username:', username); // Debug log
    console.log('Auth middleware - Headers:', req.headers); // Debug log
    console.log('Auth middleware - Body:', req.body); // Debug log
    
    if (!username) {
      console.log('No username provided in request');
      return res.status(401).json({ error: 'User not authenticated - no username provided' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('User authenticated successfully:', username);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};