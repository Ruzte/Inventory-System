import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import Statistics from '../components/statistics';
import TotalSales from '../components/totalSales'; 
import Calendar from '../components/calendar'; 
import '../scrollbar.css'; 

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [saleUnits, setSaleUnits] = useState(1);
  const [dropdownKey, setDropdownKey] = useState(0); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addQuantity, setAddQuantity] = useState(1);
  const [salesRefreshTrigger, setSalesRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // fetchItems accessible globally
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  // Filter and sort items based on search
  const getFilteredItems = () => {
    const availableItems = items.filter((item) => item.status !== "Deleted");
    
    if (!searchTerm.trim()) {
      return availableItems;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const matchingItems = availableItems.filter(item => 
      item.name.toLowerCase().includes(searchLower)
    );
    const nonMatchingItems = availableItems.filter(item => 
      !item.name.toLowerCase().includes(searchLower)
    );
    
    // Return matching items first, then non-matching items
    return [...matchingItems, ...nonMatchingItems];
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleActionChange = (action, item, e) => {
    setSelectedItem(item);

    switch (action) {
      case 'sale':
        setSaleUnits(1);
        setShowSaleModal(true);
        break;
      case 'add':
        setAddQuantity(1);
        setShowAddModal(true);
        break;
      case 'delete':
        setShowDeleteModal(true);
        break;
      default:
        break;
    }

    // Reset dropdown to "Select Action"
    if (e?.target) {
      e.target.selectedIndex = 0;
    }
  };

  // Updated handleSaleConfirm to use the correct sales API
  const handleSaleConfirm = async () => {
    if (!selectedItem || saleUnits <= 0 || saleUnits > selectedItem.unitAmount) {
      alert("Invalid sale amount.");
      return;
    }

    try {
      // Use the correct sales endpoint
      const res = await fetch("http://localhost:5000/api/items/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItem._id,
          unitsSold: saleUnits
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Sale recorded successfully!");
        // Refresh items to show updated inventory
        fetchItems();
        // Trigger statistics refresh
        setSalesRefreshTrigger(prev => prev + 1);
        setShowSaleModal(false);
        setSelectedItem(null);
        setSaleUnits(1);
        setDropdownKey(prev => prev + 1);
      } else {
        alert(data.error || "Failed to process sale.");
      }
    } catch (err) {
      console.error("Sale processing failed:", err);
      alert("Error processing sale.");
    }
  };

  const handleAddUnitsConfirm = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${selectedItem._id}/add-units`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addQuantity }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Units added successfully!");
        fetchItems(); 
      } else {
        alert(data.message || "Failed to add units.");
      }
    } catch (err) {
      console.error("Add units error:", err);
      alert("Error adding units.");
    }

    setShowAddModal(false);
    setAddQuantity(1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    const updatedItem = {
      ...selectedItem,
      status: "Deleted"
    };

    try {
      const res = await fetch(`http://localhost:5000/api/items/${selectedItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        fetchItems(); 
        setShowDeleteModal(false);
        setSelectedItem(null);
      } else {
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error("Delete update failed:", err);
      alert("Error processing delete.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md h-96 flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-[#2e5f52] ">PRODUCTS</h2>
            <div className="flex items-center gap-3">
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
              <button
                type="button"
                className="inline-block border px-3 py-1 rounded-md text-sm text-[#FEF5E3] bg-[#89AE29] hover:bg-[#2e5f52]"
                onClick={() => navigate('/history')}
              >
                Transaction History
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
              <thead className="sticky top-0 bg-[#dbe6a6] text-center z-10">
                <tr>
                  <th className="p-2 border w-24">Date Added</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border w-24">Points</th>
                  <th className="p-2 border w-24">Price</th>
                  <th className="p-2 border w-24">Unit</th>
                  <th className="p-2 border w-24">Total Points</th>
                  <th className="p-2 border w-24">Total Price</th>
                  <th className="p-2 border w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredItems().map((item) => {
                  const totalPoints = item.unitAmount * item.points;
                  const totalPrice = item.unitAmount * item.unitPrice;
                  const isHighlighted = searchTerm.trim() && 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  return (
                    <tr key={item._id} className={isHighlighted ? "bg-yellow-50" : ""}>
                      <td className="p-2 border">{new Date(item.dateAdded).toLocaleString()}</td>
                      <td className="p-2 border text-center">
                        {isHighlighted ? (
                          <span className="font-semibold text-[#89AE29]">{item.name}</span>
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="p-2 border text-center">{item.points}</td>
                      <td className="p-2 border text-center">{item.unitPrice}</td>
                      <td className="p-2 border text-center">{item.unitAmount}</td>
                      <td className="p-2 border text-center">{totalPoints}</td>
                      <td className="p-2 border text-center">{totalPrice}</td>
                      <td className="p-2 border">
                        <select 
                          key={dropdownKey}
                          className="min-w-8 text-xs bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#89AE29]"
                          onChange={(e) => handleActionChange(e.target.value, item, e)}
                          defaultValue=""
                        >
                          <option value="">Select Action</option>
                          <option value="sale">Sale</option>
                          <option value="add">Add Unit</option>
                          <option value="delete">Delete</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sale Modal */}
        {showSaleModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-bold text-[#2F5D55] mb-4">Sell Units for {selectedItem.name}</h3>

              <label className="text-sm text-[#2F5D55] mb-2 block">Units to Sell:</label>
              <div className="flex items-center gap-2 mb-4">
                <button
                  className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
                  onClick={() => setSaleUnits(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={selectedItem.unitAmount}
                  value={saleUnits}
                  readOnly
                  className="w-full text-center p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
                />
                <button
                  className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
                  onClick={() => setSaleUnits(prev => Math.min(selectedItem.unitAmount, prev + 1))}
                >
                  +
                </button>
              </div>

              {/* Show sale details */}
              <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                <div>Sale Value: ₱{(saleUnits * selectedItem.unitPrice).toFixed(2)}</div>
                <div>Points: {saleUnits * selectedItem.points}</div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-red-600 transition"
                  onClick={() => {
                    setShowSaleModal(false);
                    setSelectedItem(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#89AE29] text-white px-4 py-2 rounded hover:bg-[#2e5f52] transition"
                  onClick={handleSaleConfirm}
                >
                  Confirm 
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg text-[#2F5D55] font-bold mb-4">Add Units to {selectedItem?.name}</h2>

              <label className="text-sm text-[#2F5D55] mb-2 block">Units to Add:</label>
              <div className="flex items-center gap-2 justify-between mb-4">
                <button
                  className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
                  onClick={() => setAddQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={selectedItem.unitAmount}
                  value={addQuantity}
                  readOnly
                  className="w-full text-center p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
                />
                <button
                  className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a] "
                  onClick={() => setAddQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-4 p-3 ">
                Total Points: {selectedItem?.points * addQuantity}
                <br />
                Total Price: ₱{selectedItem?.unitPrice * addQuantity}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-red-600 transition"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddQuantity(1);
                  }}
                >
                  Cancel
                </button>
                <button
                  className=" bg-[#89AE29] text-white px-4 py-2 rounded hover:bg-[#2e5f52] transition"
                  onClick={handleAddUnitsConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-bold text-[#2F5D55] mb-4">
                Delete {selectedItem.name}?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to delete this item? This will mark the item as deleted but keep it in records.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-[#2e5f52] transition"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Section */}
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between ">
            <Calendar />
        </div>
        
        {/* Statistics Section */}
        <div className="col-span-2 h-full">
            <Statistics items={items} salesRefreshTrigger={salesRefreshTrigger} />
        </div>

        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between ">
          <h2 className="text-xl text-[#2e5f52] font-bold mb-4">TOTAL REVENUE</h2>
          <TotalSales salesRefreshTrigger={salesRefreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;