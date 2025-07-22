const Statistics = ({ items }) => {

  const totalItems = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.unitAmount, 0);
  const totalPoints = items.reduce(
    (sum, item) => sum + item.unitAmount * item.points,
    0
  );
  const totalRevenue = items.reduce(
    (sum, item) => sum + item.unitAmount * item.unitPrice,
    0
  );
  const availableItems = items.filter(
    (item) => item.status === "Available"
  ).length;
  const deletedItems = items.filter((item) => item.status === "Deleted").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 my-6 min-h-28">
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-110">
        <h2 className="text-sm text-gray-500">📦 Total Items </h2>
        <p className="text-xl font-bold text-center p-2">{totalItems}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-110">
        <h2 className="text-sm text-gray-500">🔢 Total Units</h2>
        <p className="text-xl font-bold text-center p-2">{totalUnits}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-110">
        <h2 className="text-sm text-gray-500">⭐ Total Points</h2>
        <p className="text-xl font-bold text-center p-2">{totalPoints}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-110">
        <h2 className="text-sm text-gray-500">💰 Stock Value</h2>
        <p className="text-xl font-bold mt-2">AED {totalRevenue.toFixed(2)}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-110">
        <h2 className="text-sm text-gray-500">🟢 Available Items</h2>
        <p className="text-xl font-bold text-center p-2">{availableItems}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:scale-110">
        <h2 className="text-sm text-gray-500">❌ Deleted Items</h2>
        <p className="text-xl font-bold text-center p-2">{deletedItems}</p>
      </div>
      
    </div>
  );
};

export default Statistics;