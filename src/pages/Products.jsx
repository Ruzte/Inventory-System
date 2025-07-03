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
  <select className="w-full mb-2 p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700">
    <option value="">Select category</option>
    <option value="electronics">Electronics</option>
    <option value="clothing">Clothing</option>
    <option value="supplies">Supplies</option>
    <option value="add-new">+ Add New Category</option>
  </select>

  {/* Optional: Text input for new category if "+ Add New" selected */}
  <input
    type="text"
    className="w-full mb-4 p-2 rounded bg-[#fff9e5] border border-dashed border-gray-400 text-gray-700"
    placeholder="Enter new category name"
  />

  {/* Cost Price */}
  <label className="text-sm text-[#2F5D55] mb-1">Cost Price</label>
  <div className="flex items-center gap-2 mb-4">
    <span className="text-[#2F5D55]">{getCurrencySymbol()}</span>
    <input
      type="number"
      className="w-full p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
      placeholder="0.00"
    />
  </div>

  {/* Selling Price */}
  <label className="text-sm text-[#2F5D55] mb-1">Selling Price</label>
  <div className="flex items-center gap-2">
    <span className="text-[#2F5D55]">{getCurrencySymbol()}</span>
    <input
      type="number"
      className="w-full p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
      placeholder="0.00"
    />
  </div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;
