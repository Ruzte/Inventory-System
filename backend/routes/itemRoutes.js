import express from "express";
import Item from "../models/Item.js";
import Sale from "../models/sale.js";
import { getUserFromRequest } from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(getUserFromRequest);

// POST /api/items - Add a new item
router.post("/", async (req, res) => {
  try {
    const { name, unitAmount, points, unitPrice } = req.body;

    const newItem = new Item({
      userId: req.user._id, // Associate with current user
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

// GET /api/items - Get all items for current user
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user._id }).sort({ dateAdded: -1 });
    res.json(items);
  } catch (error) {
    console.error("Fetch items error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/items/:id - Update item (only if user owns it)
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body, 
      { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found or not authorized" });
    }
    
    res.json(updatedItem);
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/items/:id/add-units - Add units to item (only if user owns it)
router.patch("/:id/add-units", async (req, res) => {
  const { id } = req.params;
  const { addQuantity } = req.body;

  try {
    const item = await Item.findOne({ _id: id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: "Item not found or not authorized" });

    item.unitAmount += parseInt(addQuantity);
    await item.save();

    res.json({ message: "Item updated", item });
  } catch (error) {
    console.error("Add units error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/items/sale - Make a sale (only if user owns the item)
router.post("/sale", async (req, res) => {
  try {
    const { itemId, unitsSold } = req.body;

    const item = await Item.findOne({ _id: itemId, userId: req.user._id });
    if (!item) return res.status(404).json({ error: "Item not found or not authorized" });

    if (item.unitAmount < unitsSold) {
      return res.status(400).json({ error: "Not enough units in stock" });
    }

    item.unitAmount -= unitsSold;
    await item.save();

    const totalValue = unitsSold * item.unitPrice;

    const newSale = new Sale({
      userId: req.user._id, // Associate sale with user
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

// GET /api/items/sales - Get all sales for current user with item details
router.get("/sales", async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.user._id }).populate("itemId");
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items/sales-total - Get total sales revenue for current user (with optional month/year filter)
router.get("/sales-total", async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Start with base match condition for current user
    let matchCondition = { userId: req.user._id };
    
    // If month and year are provided, add date filtering
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1); // Start of month
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999); // End of month
      
      matchCondition.dateSold = {  // Changed from createdAt to dateSold
        $gte: startDate,
        $lte: endDate
      };
    }
    
    const totalSales = await Sale.aggregate([
      {
        $match: matchCondition
      },
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