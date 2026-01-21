const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  businessName: { type: String, default: "" },

  email: {
    type: String,
    default: undefined,
    unique: true,
    sparse: true
  },

  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  emailVerificationExpiry: { type: Date, default: null },

  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
});

module.exports = mongoose.model("User", userSchema);
