import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

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

  // ⬇️ Make fetchItems accessible globally
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
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

  const handleSaleConfirm = async () => {
    if (!selectedItem || saleUnits <= 0 || saleUnits > selectedItem.unitAmount) {
      alert("Invalid sale amount.");
      return;
    }

    const updatedItem = {
      ...selectedItem,
      unitAmount: selectedItem.unitAmount - saleUnits
    };

    try {
      const res = await fetch(`http://localhost:5000/api/items/${selectedItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        setItems(prev => prev.map(i => i._id === selectedItem._id ? updatedItem : i));
        setShowSaleModal(false);
        setSelectedItem(null);
        setSaleUnits(1);
        setDropdownKey(prev => prev + 1); // reset dropdowns
      } else {
        alert("Failed to update item.");
      }
    } catch (err) {
      console.error("Sale update failed:", err);
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
        fetchItems(); // ⬅️ now accessible here
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
        fetchItems(); // ⬅️ refresh items after soft delete
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
        {/* Inventory Section */}
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#89AE29] ">PRODUCTS</h2>
            <button
              type="button"
              className="inline-block hover:scale-105 transition-transform duration-200 border px-3 py-1 rounded-md text-sm text-[#FEF5E3] bg-[#89AE29]"
              onClick={() => navigate('/history')}
            >
              Transaction History
            </button>
          </div>
          <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
            <thead className="bg-[#dbe6a6] text-center">
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
              {items
              .filter((item) => item.status !== "Deleted") // ⬅️ Soft delete filter
              .map((item) => {
                const totalPoints = item.unitAmount * item.points;
                const totalPrice = item.unitAmount * item.unitPrice;
                return (
                  <tr key={item._id}>
                    <td className="p-2 border">{new Date(item.dateAdded).toLocaleString()}</td>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.points}</td>
                    <td className="p-2 border">{item.unitPrice}</td>
                    <td className="p-2 border">{item.unitAmount}</td>
                    <td className="p-2 border">{totalPoints}</td>
                    <td className="p-2 border">{totalPrice}</td>
                    <td className="p-2 border">
                      <select 
                        key={dropdownKey}
                        className="min-w-8 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#89AE29]"
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
                  –
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

              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowSaleModal(false);
                    setSelectedItem(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#2e5f52] text-white px-4 py-2 rounded hover:bg-green-800"
                  onClick={handleSaleConfirm}
                >
                  Confirm Sale
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded shadow-md w-80">
              <h2 className="text-lg font-semibold mb-4">Add Units to {selectedItem?.name}</h2>

              <div className="flex items-center justify-between mb-4">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setAddQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="text-lg font-bold">{addQuantity}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setAddQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Total Points: {selectedItem?.points * addQuantity}
                <br />
                Total Price: ₱{selectedItem?.unitPrice * addQuantity}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-1 bg-gray-300 rounded"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddQuantity(1);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-[#89AE29] text-white rounded"
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
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between ">
          <h2 className="text-xl text-[#89AE29] font-bold mb-4">STATISTICS</h2>
          <div className="space-y-4">
            <div className="bg-green-100 p-4 rounded shadow text-center font-semibold text-green-800">GAIN</div>
            <div className="bg-red-100 p-4 rounded shadow text-center font-semibold text-red-800">LOSS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
