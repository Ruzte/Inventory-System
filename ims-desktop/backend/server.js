import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env")
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
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
    
    // ONLY fix the email index - NEVER delete users
    try {
      // Drop the problematic email index
      await mongoose.connection.db.collection('users').dropIndex('email_1');
      console.log('📧 Dropped email index');
    } catch (err) {
      console.log('📧 No email index found (this is fine)');
    }

    // Create a new email index that handles nulls properly
    try {
      await mongoose.connection.db.collection('users').createIndex(
        { email: 1 }, 
        { 
          unique: true, 
          sparse: true,
          partialFilterExpression: { 
            email: { $exists: true, $ne: null, $ne: "" } 
          }
        }
      );
      console.log('📧 Created proper email index');
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