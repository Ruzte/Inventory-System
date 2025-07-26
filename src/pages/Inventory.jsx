import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const [points, setPoints] = useState(1);
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [items, setItems] = useState([]);
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  const incrementPoints = () => setPoints(prev => prev + 1);
  const decrementPoints = () => setPoints(prev => (prev > 0 ? prev - 1 : 0));

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

  // Check authentication on component mount
  useEffect(() => {
    const username = getUsername();
    if (!username) {
      alert('Please log in first');
      navigate('/login');
    }
  }, [navigate]);

  const handleConfirm = async () => {
    try {
      const username = getUsername();
      if (!username) {
        alert('Please log in first');
        navigate('/login');
        return;
      }

      const newItem = {
        name: productName,
        unitAmount: quantity,
        points,
        unitPrice,
        status: "Available"
      };

      const res = await fetch("http://localhost:5000/api/items/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-username': username
        },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Item added successfully!");
        
        // Add the new item to the existing items array
        const itemWithDate = {
          ...newItem,
          dateAdded: new Date().toISOString(), 
        };
        
        setItems(prevItems => [...prevItems, itemWithDate]);
        
        // Reset form fields
        setProductName("");
        setQuantity(0);
        setPoints(1);
        setUnitPrice("");
      } else {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        alert(data.message || "Failed to add item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting item.");
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const username = getUsername();
        if (!username) {
          alert('Please log in first');
          navigate('/login');
          return;
        }

        const res = await fetch("http://localhost:5000/api/items", {
          headers: {
            'x-username': username
          }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            alert('Session expired. Please log in again.');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch items');
        }
        
        const data = await res.json();
        
        // Sort by dateAdded in descending order (most recent first)
        const sortedData = data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        
        setItems(sortedData);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        alert("Failed to fetch items. Please try again.");
      }
    };

    fetchItems();
  }, [navigate]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Inventory Section */}
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md h-[81vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#2e5f52] ">INVENTORY</h2>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
              <thead className="sticky top-0 bg-[#dbe6a6] text-center">
                <tr>
                  <th className="p-2 border  ">Date Added</th>
                  <th className="p-2 border ">Product</th>
                  <th className="p-2 border ">Points</th>
                  <th className="p-2 border ">Price</th>
                  <th className="p-2 border ">Units</th>
                  <th className="p-2 border ">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border text-center">{new Date(item.dateAdded).toLocaleString()}</td>
                    <td className="p-2 border text-center">{item.name}</td>
                    <td className="p-2 border text-center">{item.points}</td>
                    <td className="p-2 border text-center">{item.unitPrice}</td>
                    <td className="p-2 border text-center">{item.unitAmount}</td>
                    <td className="p-2 border text-center">
                      {item.status === "Deleted" ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                          Deleted
                        </span>
                      ) : item.unitAmount === 0 ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                          No Stock
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Item */}
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl text-[#2e5f52] font-bold mb-4">ADD PRODUCT</h2>

          {/* Product Name */}
          <label className="text-sm text-[#2F5D55] mb-1">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
            placeholder="Enter product name"
          />

          {/* Quantity Field */}
          <label className="text-sm text-[#2F5D55] mb-1">Unit(s)</label>
          <div className="flex items-center gap-2 mb-4 w-full">
            <button
              onClick={decrementQuantity}
              className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
            >
              -
            </button>
            <input
              type="number"
              readOnly
              value={quantity}
              className="w-full p-2 text-center rounded bg-[#f9f3d9] shadow-sm text-gray-700"
            />
            <button
              onClick={incrementQuantity}
              className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
            >
              +
            </button>
          </div>

          {/* Points Field */}
          <label className="text-sm text-[#2F5D55] mb-1">Points</label>
          <div className="flex items-center gap-2 mb-4 w-full">
            <button
              onClick={decrementPoints}
              className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
            >
              -
            </button>
            <input
              type="number"
              readOnly
              value={points}
              className="w-full p-2 text-center rounded bg-[#f9f3d9] shadow-sm text-gray-700"
            />
            <button
              onClick={incrementPoints}
              className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
            >
              +
            </button>
          </div>

          {/* Unit Price */}
          <label className="text-sm text-[#2F5D55] mb-1">Unit Price</label>
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="0.00"
            className="w-full mb-4 p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
          />

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-4 w-full">
            <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="bg-[#89AE29] text-white px-4 py-2 rounded shadow hover:bg-green-800 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;