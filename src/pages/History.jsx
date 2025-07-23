import React, { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/items/sales")
      .then(res => {
        // Group and aggregate the sales data
        const groupedSales = groupSalesByProductAndDate(res.data);
        setSales(groupedSales);
      })
      .catch(err => console.error("Failed to fetch sales:", err));
  }, []);

  const groupSalesByProductAndDate = (salesData) => {
    const grouped = {};

    salesData.forEach(sale => {
      const productName = sale.itemId.name;
      const dateSold = new Date(sale.dateSold).toLocaleDateString();
      const key = `${productName}-${dateSold}`;

      if (!grouped[key]) {
        grouped[key] = {
          itemId: {
            name: productName,
            points: sale.itemId.points,
            dateAdded: sale.itemId.dateAdded
          },
          unitPrice: sale.unitPrice,
          dateSold: sale.dateSold,
          unitsSold: 0,
          totalPoints: 0,
          totalPrice: 0
        };
      }

      // Aggregate the values
      grouped[key].unitsSold += sale.unitsSold;
      grouped[key].totalPoints += sale.itemId.points * sale.unitsSold;
      grouped[key].totalPrice += sale.unitPrice * sale.unitsSold;
    });

    // Convert grouped object back to array
    return Object.values(grouped);
  };

  // Filter sales based on search term
  const filteredSales = sales.filter(sale =>
    sale.itemId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Inventory Section */}
        <div className="col-span-3 bg-[#FEF5E3] p-4 rounded-lg shadow-md h-[35rem] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#89AE29] ">TRANSACTION HISTORY</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#89AE29] focus:border-transparent bg-white text-[#2F5D55] w-48"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
            <thead className="bg-[#dbe6a6] text-center">
              <tr>
                <th className="p-2 border">Date Added</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Points</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Unit</th>
                <th className="p-2 border">Total Points</th>
                <th className="p-2 border">Total Price</th>
                <th className="p-2 border">Date Sold</th>
                <th className="p-2 border">Total Units Sold</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-gray-400 italic">
                    {searchTerm ? `No products found matching "${searchTerm}"` : "No transactions yet."}
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{new Date(sale.itemId.dateAdded).toLocaleDateString()}</td>
                    <td className="p-2 border">{sale.itemId.name}</td>
                    <td className="p-2 border">{sale.itemId.points}</td>
                    <td className="p-2 border">₱{sale.unitPrice.toFixed(2)}</td>
                    <td className="p-2 border">1</td>
                    <td className="p-2 border">{sale.totalPoints}</td>
                    <td className="p-2 border">₱{sale.totalPrice.toFixed(2)}</td>
                    <td className="p-2 border">{new Date(sale.dateSold).toLocaleDateString()}</td>
                    <td className="p-2 border">{sale.unitsSold}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;