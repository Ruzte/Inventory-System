import React, { useEffect, useState } from "react";
import axios from "axios";
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

// And call it in your useEffect after fetching data:
useEffect(() => {
  const username = getUsername();
  if (!username) {
    alert('Please log in first');
    navigate('/login');
    return;
  }

  axios.get("http://localhost:5000/api/items/sales", {
    headers: {
      'x-username': username
    }
  })
    .then(res => {
      const groupedSales = groupSalesByProductAndDate(res.data);
      setSales(groupedSales);
      resetFocus(); // ADD THIS LINE
    })
    .catch(err => {
      console.error("Failed to fetch sales:", err);
      
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert("Failed to fetch transaction history. Please try again.");
      }
    });
}, [navigate]);

  // Check authentication on component mount
  useEffect(() => {
    const username = getUsername();
    if (!username) {
      alert('Please log in first');
      navigate('/login');
      return;
    }

    // Fetch sales data
    axios.get("http://localhost:5000/api/items/sales", {
      headers: {
        'x-username': username
      }
    })
      .then(res => {
        // Group and aggregate the sales data
        const groupedSales = groupSalesByProductAndDate(res.data);
        setSales(groupedSales);
      })
      .catch(err => {
        console.error("Failed to fetch sales:", err);
        
        // Handle authentication errors
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          alert("Failed to fetch transaction history. Please try again.");
        }
      });
  }, [navigate]);

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
                      <td className="p-2 border">{Number(sale.itemId.points).toLocaleString()}</td>
                      <td className="p-2 border">{Number(sale.unitPrice.toFixed(2)).toLocaleString()}</td>
                      <td className="p-2 border">1</td>
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