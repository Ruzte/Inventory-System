import express from "express";
import Item from "../models/Item.js";
import Sale from "../models/sale.js";

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

// PATCH /api/items/:id/add-units - Add units to item
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

// POST /api/items/sale - Make a sale
router.post("/sale", async (req, res) => {
  try {
    const { itemId, unitsSold } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.unitAmount < unitsSold) {
      return res.status(400).json({ error: "Not enough units in stock" });
    }

    item.unitAmount -= unitsSold;
    await item.save();

    const totalValue = unitsSold * item.unitPrice;

    const newSale = new Sale({
      itemId: item._id,
      unitsSold,
      unitPrice: item.unitPrice,
      totalValue,
    });

    await newSale.save();

    res.status(200).json({ message: "Sale recorded", sale: newSale });
  } catch (error) {
    console.error("Sale error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/items/sales-total - Get total sales revenue
router.get("/sales-total", async (req, res) => {
  try {
    const totalSales = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalValue" }
        }
      }
    ]);

    const revenue = totalSales[0]?.totalRevenue || 0;
    res.json({ totalRevenue: revenue });
  } catch (err) {
    console.error("Error calculating total sales revenue:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
