import React, { useEffect, useState } from "react";
import axios from "axios";

const Statistics = ({ items }) => {
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sales-total")
      .then(res => setTotalSalesRevenue(res.data.totalRevenue))
      .catch(err => console.error("Failed to fetch total sales revenue:", err));
  }, []);

  const totalItems = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.unitAmount, 0);
  const totalPoints = items.reduce((sum, item) => sum + (item.unitAmount * item.points), 0);
  const totalRevenue = items.reduce((sum, item) => sum + (item.unitAmount * item.unitPrice), 0);
  const availableItems = items.filter(item => item.status === "Available").length;

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
        <h2 className="text-sm text-gray-500">💵 Total Sales Revenue</h2>
        <p className="text-xl font-bold">₱{totalSalesRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Statistics;
