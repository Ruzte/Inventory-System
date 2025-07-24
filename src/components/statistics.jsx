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
    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 h-full">
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md  h-full flex flex-col justify-center">
        <h2 className="text-sm font-bold text-[#2e5f52] mb-4 text-center"> Total Items </h2>
        <p className="text-xl font-bold text-center ">📦{totalItems}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md h-full flex flex-col justify-center">
        <h2 className="text-sm font-bold text-[#2e5f52] mb-4 text-center"> Total Units</h2>
        <p className="text-xl font-bold text-center">🔢{totalUnits}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md h-full flex flex-col justify-center">
        <h2 className="text-sm font-bold text-[#2e5f52] mb-4 text-center"> Total Points</h2>
        <p className="text-xl font-bold text-center ">⭐{totalPoints}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md h-full flex flex-col justify-center">
        <h2 className="text-sm font-bold text-[#2e5f52] mb-4 text-center "> Stock Value</h2>
        <p className="text-xl font-bold ">💵{totalRevenue.toFixed(2)}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md h-full flex flex-col justify-center">
        <h2 className="text-sm font-bold text-[#2e5f52] mb-4 text-center"> Available Items</h2>
        <p className="text-xl font-bold text-center">🟢{availableItems}</p>
      </div>
      <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md h-full flex flex-col justify-center ">
        <h2 className="text-sm font-bold text-[#2e5f52] mb-4 text-center"> Deleted Items</h2>
        <p className="text-xl font-bold text-center ">🔴{deletedItems}</p>
      </div>
      
    </div>
  );
};

export default Statistics;