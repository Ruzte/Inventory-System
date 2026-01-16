import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, default: '' }, // New field for business name
  email: { type: String, default: undefined, unique: true, sparse: true }, // New field for email (for password recovery)
  emailVerified: { type: Boolean, default: false }, // NEW: Track if email is verified
  emailVerificationToken: { type: String, default: null }, // NEW: Email verification token
  emailVerificationExpiry: { type: Date, default: null },
  resetToken: { type: String, default: null }, // Password reset token
  resetTokenExpiry: { type: Date, default: null } // Token expiration time
});

export default mongoose.model('User', userSchema);