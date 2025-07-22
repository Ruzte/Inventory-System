import React, { useEffect, useState } from "react";
import axios from "axios";

const TotalSales = ({ salesRefreshTrigger }) => {
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-sm text-gray-500">💵 Total Sales Revenue</h2>
      <p className="text-2xl font-bold text-green-600">
        ₱{totalSalesRevenue.toFixed(2)}
      </p>
    </div>
  );
};

export default TotalSales;