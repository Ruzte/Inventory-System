const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load main/.env
dotenv.config({
  path: path.join(__dirname, ".env")
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("✅ MongoDB connected");
}


module.exports = { connectDB };
