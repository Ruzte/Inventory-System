import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  unitAmount: { type: Number, required: true },
  points: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now }, 
  status: { type: String, default: "Available" },
});

export default mongoose.model("Item", itemSchema);