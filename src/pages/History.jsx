import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../scrollbar.css';

function History() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to get username from localStorage
  const getUsername = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.username;
      }
      return null;
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  };

  // ADD THIS FUNCTION after getUsername function
  const resetFocus = () => {
    setTimeout(() => {
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
      document.body.focus();
      document.body.blur();
      
      document.querySelectorAll('input, textarea').forEach(input => {
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
      });
    }, 100);
  };

  // Check authentication on component mount
  useEffect(() => {
    const loadSales = async () => {
      const username = getUsername();
      if (!username) {
        alert('Please log in first');
        navigate('/login');
        return;
      }

      try {
        const data = await window.api.getSales(username);
        const groupedSales = groupSalesByProductDateAndPrice(data);
        setSales(groupedSales);
        resetFocus();
        
      } catch (err) {
        console.error("Failed to fetch sales:", err);
        alert("Failed to fetch transaction history. Please try again.");
      }
    };

    loadSales();
  }, [navigate]);


  // UPDATED FUNCTION: Now groups by product name, date, AND price
  const groupSalesByProductDateAndPrice = (salesData) => {
    const grouped = {};

    salesData.forEach((sale) => {
      // 🔥 GUARD AGAINST DELETED ITEMS
      if (!sale.itemId) return;

      const productName = sale.itemId.name;
      const dateSold = new Date(sale.dateSold).toLocaleDateString();
      const unitPrice = sale.unitPrice;

      const key = `${productName}-${dateSold}-${unitPrice}`;

      if (!grouped[key]) {
        grouped[key] = {
          itemId: {
            name: sale.itemId.name,
            points: sale.itemId.points,
            dateAdded: sale.itemId.dateAdded,
          },
          unitPrice: sale.unitPrice,
          dateSold: sale.dateSold,
          unitsSold: 0,
          totalPoints: 0,
          totalPrice: 0,
        };
      }

      grouped[key].unitsSold += sale.unitsSold;
      grouped[key].totalPoints += sale.itemId.points * sale.unitsSold;
      grouped[key].totalPrice += sale.unitPrice * sale.unitsSold;
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(b.dateSold) - new Date(a.dateSold)
    );
  };


  // Filter sales based on search term
  const filteredSales = sales.filter(sale =>
    sale.itemId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* History Section */}
        <div className="col-span-3 bg-[#FEF5E3] p-4 rounded-lg shadow-md h-[81vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#2e5f52] ">TRANSACTION HISTORY</h2>
            
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
          <div className="flex-1 overflow-x-auto min-h-0 custom-scrollbar">
            <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
              <thead className="sticky top-0 bg-[#dbe6a6] text-center z-10">
                <tr>
                  <th className="p-2 border">Date Added</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Points</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Total Points</th>
                  <th className="p-2 border">Total Price</th>
                  <th className="p-2 border">Date Sold</th>
                  <th className="p-2 border">Total Units Sold</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-4 text-gray-400 italic">
                      {searchTerm ? `No products found matching "${searchTerm}"` : "No transactions yet."}
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{new Date(sale.itemId.dateAdded).toLocaleDateString()}</td>
                      <td className="p-2 border">{sale.itemId.name}</td>
                      <td className="p-2 border">{Number(sale.itemId.points).toLocaleString()}</td>
                      <td className="p-2 border">{Number(sale.unitPrice.toFixed(2)).toLocaleString()}</td>
                      <td className="p-2 border">{Number(sale.totalPoints).toLocaleString()}</td>
                      <td className="p-2 border">{Number(sale.totalPrice.toFixed(2)).toLocaleString()}</td>
                      <td className="p-2 border">{new Date(sale.dateSold).toLocaleDateString()}</td>
                      <td className="p-2 border">{Number(sale.unitsSold).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;