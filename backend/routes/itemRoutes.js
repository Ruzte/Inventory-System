import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// POST /api/items - Add a new item
router.post("/", async (req, res) => {
  try {
    const { name, unitAmount, points, unitPrice } = req.body;

    const newItem = new Item({
      name,
      unitAmount,
      points,
      unitPrice,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items - Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ dateAdded: -1 });
    res.json(items);
  } catch (error) {
    console.error("Fetch items error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
