import React, { useEffect, useState } from "react";
import axios from "axios";

const Statistics = ({ items, salesRefreshTrigger }) => {
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);

  // Function to fetch sales revenue
  const fetchSalesRevenue = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items/sales-total");
      setTotalSalesRevenue(res.data.totalRevenue);
    } catch (err) {
      console.error("Failed to fetch total sales revenue:", err);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchSalesRevenue();
  }, []);

  // Refetch sales revenue when salesRefreshTrigger changes
  useEffect(() => {
    if (salesRefreshTrigger > 0) {
      fetchSalesRevenue();
    }
  }, [salesRefreshTrigger]);

  const totalItems = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.unitAmount, 0);
  const totalPoints = items.reduce(
    (sum, item) => sum + item.unitAmount * item.points,
    0
  );
  const totalRevenue = items.reduce(
    (sum, item) => sum + item.unitAmount * item.unitPrice,
    0
  );
  const availableItems = items.filter(
    (item) => item.status === "Available"
  ).length;
  const deletedItems = items.filter((item) => item.status === "Deleted").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 my-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-sm text-gray-500">📦 Total Items</h2>
        <p className="text-xl font-bold">{totalItems}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-sm text-gray-500">🔢 Total Units</h2>
        <p className="text-xl font-bold">{totalUnits}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-sm text-gray-500">⭐ Total Points</h2>
        <p className="text-xl font-bold">{totalPoints}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-sm text-gray-500">💰 Stock Value</h2>
        <p className="text-xl font-bold">₱{totalRevenue.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-sm text-gray-500">🟢 Available Items</h2>
        <p className="text-xl font-bold">{availableItems}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-sm text-gray-500">❌ Deleted Items</h2>
        <p className="text-xl font-bold">{deletedItems}</p>
      </div>
      <div className="bg-white p-4 rounded shadow col-span-2 md:col-span-3">
        <h2 className="text-sm text-gray-500">💵 Total Sales Revenue</h2>
        <p className="text-2xl font-bold text-green-600">
          ₱{totalSalesRevenue.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Statistics;