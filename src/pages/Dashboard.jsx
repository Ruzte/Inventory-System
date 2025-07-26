import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { toast } from 'react-hot-toast';
import Statistics from '../components/statistics';
import TotalSales from '../components/totalSales'; 
import Calendar from '../components/calendar'; 
import Modal from '../components/modal'; 
import UnitSelector from '../components/unitSelector'; 
import '../scrollbar.css'; 

function ActionDropdown({ item, onSelect }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left w-[115px]">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full text-xs bg-[#f0f0f0] text-[#2F5D55] border border-gray-300 rounded-full px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#89AE29] transition duration-150 ease-in-out"
      >
        Select Action
      </button>
      <div
        className={`absolute left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md transform origin-top transition-all duration-200 z-10 ${
          open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="block w-full text-left px-4 py-2 text-xs hover:bg-[#f0f0f0] text-[#2F5D55]"
          onClick={() => {
            onSelect("sale", item);
            setOpen(false);
          }}
        >
          Sale
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-xs hover:bg-[#f0f0f0] text-[#2F5D55]"
          onClick={() => {
            onSelect("add", item);
            setOpen(false);
          }}
        >
          Add Unit
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-[#f0f0f0]"
          onClick={() => {
            onSelect("delete", item);
            setOpen(false);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [saleUnits, setSaleUnits] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addQuantity, setAddQuantity] = useState(1);
  const [salesRefreshTrigger, setSalesRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // ADD THIS FUNCTION - Quick Fix for Focus Issues
  const resetFocus = () => {
    setTimeout(() => {
      // Remove focus from any active element
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
      // Reset focus state
      document.body.focus();
      document.body.blur();
      
      // Force all inputs to be focusable
      document.querySelectorAll('input, textarea').forEach(input => {
        input.style.pointerEvents = 'auto';
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
      });
    }, 100);
  };

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
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      alert("Failed to fetch items. Please try again.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getFilteredItems = () => {
    const availableItems = items.filter((item) => item.status !== "Deleted");
    if (!searchTerm.trim()) return availableItems;
    const searchLower = searchTerm.toLowerCase();
    const matches = availableItems.filter((item) => item.name.toLowerCase().includes(searchLower));
    const nonMatches = availableItems.filter((item) => !item.name.toLowerCase().includes(searchLower));
    return [...matches, ...nonMatches];
  };

  const handleActionChange = (action, item) => {
    setSelectedItem(item);
    if (action === "sale") {
      setSaleUnits(1);
      setShowSaleModal(true);
    } else if (action === "add") {
      setAddQuantity(1);
      setShowAddModal(true);
    } else if (action === "delete") {
      setShowDeleteModal(true);
    }
  };

  const handleSaleConfirm = async () => {
    if (!selectedItem || saleUnits <= 0 || saleUnits > selectedItem.unitAmount) {
      toast.error("No stock available");
      return;
    }

    try {
      const username = getUsername();
      if (!username) {
        alert('Please log in first');
        navigate('/login');
        return;
      }
      
      const res = await fetch("http://localhost:5000/api/items/sale", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-username': username
        },
        body: JSON.stringify({ itemId: selectedItem._id, unitsSold: saleUnits }),
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success("Sale recorded successfully!");
        fetchItems();
        setSalesRefreshTrigger(prev => prev + 1);
        setShowSaleModal(false);
        setSelectedItem(null);
        setSaleUnits(1);
        resetFocus(); // ADD THIS LINE - Quick Fix Applied
      } else {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        alert(data.error || "Failed to process sale.");
      }
    } catch (err) {
      console.error("Sale processing failed:", err);
      alert("Error processing sale.");
    }
  };

  const handleAddUnitsConfirm = async () => {
    try {
      const username = getUsername();
      if (!username) {
        alert('Please log in first');
        navigate('/login');
        return;
      }
      
      const res = await fetch(`http://localhost:5000/api/items/${selectedItem._id}/add-units`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          'x-username': username
        },
        body: JSON.stringify({ addQuantity }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Units added successfully!");
        fetchItems(); 
        setShowAddModal(false);
        setAddQuantity(1);
        resetFocus(); // ADD THIS LINE - Quick Fix Applied
      } else {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        alert(data.message || "Failed to add units.");
      }
    } catch (err) {
      console.error("Add units error:", err);
      alert("Error adding units.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      const username = getUsername();
      if (!username) {
        alert('Please log in first');
        navigate('/login');
        return;
      }
      
      const res = await fetch(`http://localhost:5000/api/items/${selectedItem._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'x-username': username
        },
        body: JSON.stringify({ ...selectedItem, status: "Deleted" }),
      });

      if (res.ok) {
        fetchItems(); 
        setShowDeleteModal(false);
        setSelectedItem(null);
        resetFocus(); // ADD THIS LINE - Quick Fix Applied
      } else {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
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
        {/* Products */}
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md h-[60vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#2e5f52]">PRODUCTS</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#89AE29] bg-white text-[#2F5D55] w-48"
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
                className="border px-3 py-1 rounded-md text-sm text-[#FEF5E3] bg-[#89AE29] hover:bg-[#2e5f52]"
                onClick={() => navigate('/history')}
              >
                Transaction History
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto min-h-0 custom-scrollbar">
            <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
              <thead className="sticky top-0 bg-[#dbe6a6] text-center z-10">
                <tr>
                  <th className="p-2 border w-24">Date Added</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border w-24">Points</th>
                  <th className="p-2 border w-24">Price</th>
                  <th className="p-2 border w-24">Units</th>
                  <th className="p-2 border w-24">Total Points</th>
                  <th className="p-2 border w-24">Total Price</th>
                  <th className="p-2 border w-24">Action</th>
                  <th className="p-2 border w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredItems().map((item) => {
                  const totalPoints = item.unitAmount * item.points;
                  const totalPrice = item.unitAmount * item.unitPrice;
                  const isHighlighted = searchTerm.trim() && item.name.toLowerCase().includes(searchTerm.toLowerCase());

                  return (
                    <tr key={item._id} className={isHighlighted ? "bg-yellow-50" : ""}>
                      <td className="p-2 border">{new Date(item.dateAdded).toLocaleString()}</td>
                      <td className="p-2 border text-center">
                        {isHighlighted ? <span className="font-semibold text-[#89AE29]">{item.name}</span> : item.name}
                      </td>
                      <td className="p-2 border text-center">{Number(item.points).toLocaleString()}</td>
                      <td className="p-2 border text-center">{Number(item.unitPrice).toLocaleString()}</td>
                      <td className="p-2 border text-center">{Number(item.unitAmount).toLocaleString()}</td>
                      <td className="p-2 border text-center">{Number(totalPoints).toLocaleString()}</td>
                      <td className="p-2 border text-center">{Number(totalPrice).toLocaleString()}</td>
                      <td className="p-2 border text-center">
                        <ActionDropdown item={item} onSelect={handleActionChange} />
                      </td>
                      <td className="p-2 border text-center">
                        {item.status === "Deleted" ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Deleted
                          </span>
                        ) : item.unitAmount === 0 ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                            No Stock
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showSaleModal && selectedItem && (
          <Modal
            title={`Sell Units for ${selectedItem.name}`}
            onCancel={() => { setShowSaleModal(false); setSelectedItem(null); resetFocus(); }}
            onConfirm={handleSaleConfirm}
            confirmText="Confirm"
          >
            <UnitSelector
              value={saleUnits}
              setValue={setSaleUnits}
              max={selectedItem.unitAmount}
              label="Units to Sell:"
              price={selectedItem.unitPrice}
              points={selectedItem.points}
            />
          </Modal>
        )}

        {showAddModal && selectedItem && (
          <Modal
            title={`Add Units to ${selectedItem.name}`}
            onCancel={() => { setShowAddModal(false); setAddQuantity(1); resetFocus(); }}
            onConfirm={handleAddUnitsConfirm}
            confirmText="Confirm"
          >
            <UnitSelector
              value={addQuantity}
              setValue={setAddQuantity}
              label="Units to Add:"
              price={selectedItem.unitPrice}
              points={selectedItem.points}
            />
          </Modal>
        )}

        {showDeleteModal && selectedItem && (
          <Modal
            title={`Delete ${selectedItem.name}?`}
            onCancel={() => { setShowDeleteModal(false); resetFocus(); }}
            onConfirm={handleDeleteConfirm}
            confirmText="Confirm Delete"
            danger
          >
            <p className="text-sm text-gray-700">
              Are you sure you want to delete this item? This will mark the item as deleted but keep it in records.
            </p>
          </Modal>
        )}

        {/* Calendar & Statistics */}
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between">
          <Calendar />
        </div>
        <div className="col-span-2 h-full">
          <Statistics items={items} salesRefreshTrigger={salesRefreshTrigger} />
        </div>
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl text-[#2e5f52] font-bold mb-4">TOTAL REVENUE</h2>
          <TotalSales salesRefreshTrigger={salesRefreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;