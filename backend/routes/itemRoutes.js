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
      status: "Available",
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

// PUT /api/items/:id - Update item
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id/add-units", async (req, res) => {
  const { id } = req.params;
  const { addQuantity } = req.body;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.unitAmount += parseInt(addQuantity);
    await item.save();

    res.json({ message: "Item updated", item });
  } catch (error) {
    console.error("Add units error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
