import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(`✅ Connected to MongoDB`);
    
    // Debug: Check current users and indexes
    try {
      const users = await mongoose.connection.db.collection('users').find({}).toArray();
      console.log('👥 Current users:', users.map(u => ({ username: u.username, email: u.email })));
      
      const indexes = await mongoose.connection.db.collection('users').indexes();
      console.log('📊 Current indexes:', indexes);
    } catch (err) {
      console.log('Debug error:', err.message);
    }
    
    // Clean up duplicate null emails
    try {
      const usersWithNullEmail = await mongoose.connection.db.collection('users').find({
        $or: [{ email: null }, { email: "" }, { email: { $exists: false } }]
      }).toArray();
      
      console.log(`🔍 Found ${usersWithNullEmail.length} users with null/empty emails`);
      
      if (usersWithNullEmail.length > 1) {
        // Keep the first one, delete the rest
        const idsToDelete = usersWithNullEmail.slice(1).map(user => user._id);
        await mongoose.connection.db.collection('users').deleteMany({_id: {$in: idsToDelete}});
        console.log(`🧹 Deleted ${idsToDelete.length} duplicate users`);
      }
      
      // Set remaining null/empty emails to undefined
      await mongoose.connection.db.collection('users').updateMany(
        { $or: [{ email: null }, { email: "" }] },
        { $unset: { email: 1 } }
      );
      console.log('🔧 Cleaned up remaining null/empty emails');
      
    } catch (err) {
      console.log('Cleanup error:', err.message);
    }
    
    // Drop and recreate the email index
    try {
      await mongoose.connection.db.collection('users').dropIndex('email_1');
      console.log('📧 Dropped old email index');
    } catch (err) {
      console.log('📧 Email index not found (this is fine)');
    }
    
    // Create new index
    try {
      await mongoose.connection.db.collection('users').createIndex(
        { email: 1 }, 
        { 
          unique: true, 
          sparse: true
        }
      );
      console.log('📧 Created new email index');
    } catch (err) {
      console.log('📧 Index creation error:', err.message);
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });