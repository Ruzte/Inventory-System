import { useCurrency } from "../context/Currency";
import { useState } from "react";


function Dashboard() {
  const { currency } = useCurrency();
   const getCurrencySymbol = () => {
    switch (currency) {
      case "USD":
        return "$";
      case "PHP":
        return "₱";
      case "EUR":
        return "€";
      default:
        return "$";
    }
  };

  const [quantity, setQuantity] = useState(0);

const incrementQuantity = () => setQuantity(prev => prev + 1);
const decrementQuantity = () =>
  setQuantity(prev => (prev > 0 ? prev - 1 : 0));
 const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "add-new") {
      setShowModal(true);
    } else {
      setSelectedCategory(value);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
    }
    setNewCategory("");
    setShowModal(false);
  };


  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#89AE29] ">INVENTORY</h2>
          </div>
          <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
            <thead className="bg-[#dbe6a6] text-center">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Cost Price</th>
                <th className="p-2 border">Selling Price</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">-</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add Item */}
<div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between">
  <h2 className="text-xl text-[#89AE29] font-bold mb-4 text-center">ADD ITEM</h2>

  {/* Add Photo */}
  <div className="flex justify-center mb-4">
    <div className="bg-[#E4DED0] p-4 rounded shadow text-center text-sm text-[#2F5D55] w-32 h-32 flex items-center justify-center">
      Add Photo
    </div>
  </div>

  {/* Item Name */}
  <label className="text-sm text-[#2F5D55] mb-1">Item Name</label>
  <input
    type="text"
    className="w-full mb-4 p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
    placeholder="Enter item name"
  />

  {/* Quantity Field */}
<label className="text-sm text-[#2F5D55] mb-1">Quantity</label>
<div className="flex items-center gap-2 mb-4">
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


  {/* Category Dropdown */}
<label className="text-sm text-[#2F5D55] mb-1">Category</label>
<select
  value={selectedCategory}
  onChange={handleCategoryChange}
  className="w-full mb-2 p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
>
  <option value="">Select category</option>
  {categories.map((cat, index) => (
    <option key={index} value={cat}>
      {cat}
    </option>
  ))}
  <option value="add-new">+ Add New Category</option>
</select>

{/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg w-80">
      <h3 className="text-lg font-semibold mb-4 text-[#2F5D55]">Add New Category</h3>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Enter category name"
        className="w-full p-2 mb-4 rounded bg-[#f9f3d9] text-gray-700 shadow-sm"
      />
      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => {
            setShowModal(false);
            setNewCategory("");
          }}
        >
          Cancel
        </button>
        <button
          className="bg-[#2e5f52] text-white px-4 py-2 rounded hover:bg-green-800"
          onClick={handleAddCategory}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}



  {/* Prices Row */}
<div className="flex gap-4 mb-4">
  {/* Cost Price */}
  <div className="w-1/2">
    <label className="text-sm text-[#2F5D55] mb-1 block">Cost Price</label>
    <div className="flex items-center gap-2">
      <span className="text-[#2F5D55]">{getCurrencySymbol()}</span>
      <input
        type="number"
        placeholder="0.00"
        className="w-full p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
      />
    </div>
  </div>

  {/* Selling Price */}
  <div className="w-1/2">
    <label className="text-sm text-[#2F5D55] mb-1 block">Selling Price</label>
    <div className="flex items-center gap-2">
      <span className="text-[#2F5D55]">{getCurrencySymbol()}</span>
      <input
        type="number"
        placeholder="0.00"
        className="w-full p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
      />
    </div>
  </div>
</div>

  {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
              Cancel
            </button>
            <button className="bg-[#2e5f52] text-white px-4 py-2 rounded shadow hover:bg-green-800 transition">
              Confirm
            </button>
          </div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;
