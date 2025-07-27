import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, default: '' }, // New field for business name
  email: { type: String, default: '' } // New field for email (for password recovery)
});

export default mongoose.model('User', userSchema);