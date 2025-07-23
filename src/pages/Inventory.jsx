  import { useCurrency } from "../context/Currency";
  import { useEffect, useState } from "react";

  function Dashboard() {
    const { currency } = useCurrency();
    const getCurrencySymbol = () => {
      switch (currency) {
        case "USD":
          return "$";
        case "PHP":
          return "₱";
        case "AED":
          return "د.إ";
        default:
          return "$";
      }
    };

    const [quantity, setQuantity] = useState(0);
    const [points, setPoints] = useState(1);
    const [productName, setProductName] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [items, setItems] = useState([]);

    useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };

    fetchItems();
  }, []);
    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () =>setQuantity(prev => (prev > 0 ? prev - 1 : 0));

    const incrementPoints = () => setPoints(prev => prev + 1);
    const decrementPoints = () => setPoints(prev => (prev > 0 ? prev - 1 : 0));

    const handleConfirm = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          unitAmount: quantity,
          points,
          unitPrice,
          status: "Available"
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Item added successfully!");
        // Optional: reset form fields
        setProductName("");
        setQuantity(0);
        setPoints(1);
        setUnitPrice("");
      } else {
        alert(data.message || "Failed to add item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting item.");
    }
  };

    return (
      <div>
        <div className="grid grid-cols-3 gap-6">
          {/* Inventory Section */}
          <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md h-[35rem] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#89AE29] ">INVENTORY</h2>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
                <thead className="sticky top-0 bg-[#dbe6a6] text-center">
                  <tr>
                    <th className="p-2 border ">Date Added</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border ">Unit Amount</th>
                    <th className="p-2 border ">Points</th>
                    <th className="p-2 border ">Unit Price</th>
                    <th className="p-2 border ">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{new Date(item.dateAdded).toLocaleString()}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.points}</td>
                      <td className="p-2 border">{item.unitPrice}</td>
                      <td className="p-2 border">{item.unitAmount}</td>
                      <td className="p-2 border">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Item */}
          <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-xl text-[#89AE29] font-bold mb-4 ">ADD PRODUCT</h2>
            {/* Item Name */}
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
            {/* Points Field */}
            <label className="text-sm text-[#2F5D55] mb-1">Points</label>
            <div className="flex items-center gap-2 mb-4">
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
            {/* Price */}
            <div className="w-1/2">
              <label className="text-sm text-[#2F5D55] mb-1 block">Unit Price</label>
              <div className="flex items-center gap-2">
                <span className="text-[#2F5D55]">{getCurrencySymbol()}</span>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
                />
              </div>
            </div>

          {/* Buttons */}
              <div className="flex flex-col gap-4 mt-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="bg-[#2e5f52] text-white px-4 py-2 rounded shadow hover:bg-green-800 transition"
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
