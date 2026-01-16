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
          className="block w-full text-left px-4 py-2 text-xs hover:bg-[#f0f0f0] text-[#2F5D55]"
          onClick={() => {
            onSelect("update", item);
            setOpen(false);
          }}
        >
          Change Price
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

// New PriceInput component for the price change modal
function PriceInput({ value, setValue, currentPrice, label = "New Price:" }) {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    // Allow empty string or valid decimal numbers
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-[#2F5D55]">
        <span className="font-medium">Current Price: </span>
        <span className="text-[#89AE29] font-semibold">{Number(currentPrice).toLocaleString()}</span>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#2F5D55] mb-2">
          {label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2F5D55] font-medium">💵</span>
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="0.00"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#89AE29] focus:border-transparent text-[#2F5D55]"
            autoFocus
          />
        </div>
        {value && !isNaN(parseFloat(value)) && (
          <div className="mt-2 text-xs text-gray-600">
            New price: {Number(parseFloat(value)).toLocaleString()}
          </div>
        )}
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
  // NEW STATE FOR PRICE CHANGE MODAL
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [newPrice, setNewPrice] = useState('');
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
        return userData?.username || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  };

  const fetchItems = async () => {
  try {
    const username = getUsername();
    if (!username) {
      navigate('/login');
      return;
    }

    const data = await window.api.getItems(username);
    setItems(data);
  } catch (err) {
    console.error("Failed to fetch items:", err);
    toast.error("Failed to fetch items");
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

  // UPDATED handleActionChange function to include price update case
  const handleActionChange = (action, item) => {
    if (!item || !item._id) return;

    setSelectedItem(item);

    if (action === "sale") {
      setSaleUnits(1);
      setShowSaleModal(true);
    } else if (action === "add") {
      setAddQuantity(1);
      setShowAddModal(true);
    } else if (action === "update") {
      setNewPrice(String(item.unitPrice ?? 0));
      setShowPriceModal(true);
    } else if (action === "delete") {
      setShowDeleteModal(true);
    }
  };


  const handleSaleConfirm = async () => {
    const safeUnits = Number(saleUnits);

    if (
      !selectedItem ||
      !Number.isFinite(safeUnits) ||
      safeUnits <= 0 ||
      safeUnits > Number(selectedItem.unitAmount)
    ) {
      toast.error("Invalid sale quantity");
      return;
    }

    try {
      const username = getUsername();

      await window.api.saleItem({
        username,
        itemId: selectedItem._id,
        quantity: safeUnits // ✅ IMPORTANT: quantity, not unitsSold
      });

      toast.success("Sale recorded successfully!");
      fetchItems();
      setSalesRefreshTrigger(prev => prev + 1);
      setShowSaleModal(false);
      resetFocus();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Sale failed");
    }
  };

  const handleAddUnitsConfirm = async () => {
    const safeAmount = Number(addQuantity);

    if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
      toast.error("Invalid unit amount");
      return;
    }

    try {
      const username = getUsername();

      await window.api.addUnits({
        username,
        itemId: selectedItem._id,
        amount: safeAmount // ✅ MUST be "amount"
      });

      toast.success("Units added successfully!");
      fetchItems();
      setShowAddModal(false);
      resetFocus();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Add units failed");
    }
  };

  // NEW FUNCTION FOR HANDLING PRICE UPDATE
  const handlePriceUpdateConfirm = async () => {
    const safePrice = Number(newPrice);

    if (!Number.isFinite(safePrice) || safePrice <= 0) {
      toast.error("Invalid price");
      return;
    }

    try {
      const username = getUsername();

      await window.api.updatePrice({
        username,
        itemId: selectedItem._id,
        newPrice: safePrice
      });

      toast.success("Price updated!");
      fetchItems();
      setShowPriceModal(false);
      resetFocus();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Price update failed");
    }
  };



  const handleDeleteConfirm = async () => {
  try {
    const username = getUsername();
    await window.api.deleteItem({
      username,
      itemId: selectedItem._id
    });

    fetchItems();
    setShowDeleteModal(false);
    resetFocus();
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Delete failed");
  }
};


  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Left Side: Products + Statistics (stacked) - Takes up 2/3 of the width */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Products Section */}
          <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md h-[60vh] flex flex-col">
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
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
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
                        <td className="p-2 border">{item.dateAdded
  ? new Date(item.dateAdded).toLocaleString()
  : "-"
}</td>
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

          {/* Statistics Section - Below products */}
          <div className="rounded-lg shadow-md h-[140px] overflow-hidden">
            <Statistics items={items} salesRefreshTrigger={salesRefreshTrigger} />
          </div>
        </div>

        {/* Right Side: Calendar - Takes up 1/3 of the width */}
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md h-[81vh] flex flex-col">
          <Calendar salesRefreshTrigger={salesRefreshTrigger} />
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

      {/* NEW PRICE CHANGE MODAL */}
      {showPriceModal && selectedItem && (
        <Modal
          title={`Change Price for ${selectedItem.name}`}
          onCancel={() => { 
            setShowPriceModal(false); 
            setSelectedItem(null); 
            setNewPrice(''); 
            resetFocus(); 
          }}
          onConfirm={handlePriceUpdateConfirm}
          confirmText="Update Price"
        >
          <PriceInput
            value={newPrice}
            setValue={setNewPrice}
            currentPrice={selectedItem.unitPrice}
            label="New Price:"
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
    </div>
  );
}

export default Dashboard;