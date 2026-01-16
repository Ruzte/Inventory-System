const { ipcMain } = require("electron");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Item = require("./models/Item");
const Sale = require("./models/sale");
const { connectDB } = require("./db");

function registerIpc() {

  /* =====================
     AUTH
  ====================== */

  ipcMain.handle("user:signup", async (_, data) => {
    await connectDB();

    if (!data.username || !data.password) {
      throw new Error("Username and password are required");
    }

    const existing = await User.findOne({ username: data.username });
    if (existing) throw new Error("Username already exists");

    const hashed = await bcrypt.hash(String(data.password), 10);

    const user = await User.create({
      username: data.username,
      email: data.email || undefined,
      password: hashed
    });

    return { id: user._id, username: user.username };
  });


  ipcMain.handle("user:login", async (_, data) => {
    await connectDB();

    const user = await User.findOne({ username: data.username });
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new Error("Invalid credentials");

    return { id: user._id, username: user.username };
  });

  /* =====================
     INVENTORY
  ====================== */

  ipcMain.handle("items:add", async (_, { username, item }) => {
    await connectDB();

    const user = await User.findOne({ username });
        if (!user) throw new Error("User not found");

        const created = await Item.create({
      name: String(item.name),
      unitAmount: Number(item.unitAmount),
      points: Number(item.points),
      unitPrice: Number(item.unitPrice),
      status: item.status || "Available",
      userId: user._id,
      dateAdded: new Date()
    });

    return {
      _id: created._id.toString(),
      name: created.name,
      unitAmount: created.unitAmount,
      points: created.points,
      unitPrice: created.unitPrice,
      status: created.status,
      dateAdded: created.dateAdded
    };
  });

  ipcMain.handle("items:get", async (_, { username }) => {
    await connectDB();

    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const items = await Item.find({ userId: user._id }).sort({ dateAdded: -1 });

    return items.map(item => ({
      _id: item._id.toString(),
      name: item.name,
      unitAmount: Number(item.unitAmount),
      points: Number(item.points),
      unitPrice: Number(item.unitPrice),
      status: item.status,
      dateAdded: item.dateAdded,
      soldAt: item.soldAt || null,
    }));
  });


  ipcMain.handle("item:delete", async (_, { itemId, username }) => {
    await connectDB();

    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    await Item.deleteOne({
      _id: itemId,
      userId: user._id
    });

    return true;
  });

  ipcMain.handle("item:addUnits", async (_, { itemId, amount, username }) => {
    await connectDB();

    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const item = await Item.findOne({
      _id: itemId,
      userId: user._id
    });

    if (!item) throw new Error("Item not found");

    item.unitAmount += Number(amount);
    await item.save();

    return {
      _id: item._id.toString(),
      unitAmount: item.unitAmount,
      status: item.status,
    };
  });

  ipcMain.handle("item:sale", async (_, { itemId, quantity, username }) => {
    await connectDB();

    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const item = await Item.findOne({ _id: itemId, userId: user._id });
    if (!item) throw new Error("Item not found");

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) throw new Error("Invalid quantity");

    if (item.unitAmount < qty) throw new Error("Not enough stock");

    // Update item
    item.unitAmount -= qty;
    item.unitsSold = (item.unitsSold || 0) + qty;
    item.status = item.unitAmount === 0 ? "Sold" : "Available";
    await item.save();

    // CREATE SALE RECORD
    await Sale.create({
      userId: user._id,
      itemId: item._id,
      unitsSold: qty,
      unitPrice: item.unitPrice,
      totalValue: qty * item.unitPrice
    });

    return true;
  });


  ipcMain.handle("item:updatePrice", async (_, { itemId, newPrice, username }) => {
    await connectDB();

    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const price = Number(newPrice);
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Invalid price");
    }

    const item = await Item.findOne({
      _id: itemId,
      userId: user._id
    });

    if (!item) throw new Error("Item not found");

    item.unitPrice = price;
    await item.save();

    return {
      _id: item._id.toString(),
      unitPrice: item.unitPrice
    };
  });

  ipcMain.handle("get-total-sales", async (_, payload) => {
    try {
      await connectDB();

      const { username, month, year } = payload;

      if (!username) return 0;

      const user = await User.findOne({ username });
      if (!user) return 0;

      const match = { userId: user._id };

      if (month && year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        match.dateSold = { $gte: start, $lt: end };
      }

      const result = await Sale.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalValue" }
          }
        }
      ]);

      return result[0]?.total || 0;
    } catch (err) {
      console.error("get-total-sales error:", err.message);
      return 0; // 👈 CRITICAL: prevents IPC spam
    }
  });


  ipcMain.handle("sales:get", async (_, data) => {
    await connectDB();
    
    const username = data?.username;
    if(!username) throw new Error("Username is missing");

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const sales = await Sale.find({
      userId: user._id,
      itemId: { $ne: null }
    })
      .populate("itemId")
      .sort({ dateSold: -1 })
      .lean();

    return sales;
  });

  ipcMain.handle("profile:update", async (_, data) => {
    await connectDB();

    const { username, businessName, email } = data;
    if (!username) throw new Error("Username missing");

    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    if (businessName !== undefined) user.businessName = businessName;
    if (email !== undefined) user.email = email;

    await user.save();

    return {
      username: user.username,
      businessName: user.businessName || "",
      email: user.email || "",
      emailVerified: !!user.emailVerified
    };
  });
}

module.exports = { registerIpc };
