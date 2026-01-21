import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  dateSold: { type: Date, default: Date.now },
  unitsSold: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalValue: { type: Number, required: true }, 
});

export default mongoose.model("Sale", saleSchema);