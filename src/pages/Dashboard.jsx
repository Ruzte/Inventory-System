function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Inventory Section */}
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#89AE29] ">INVENTORY</h2>
            <input
              type="text"
              placeholder="Search"
              className="border px-3 py-1 rounded-md text-sm"
            />
          </div>
          <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
            <thead className="bg-[#dbe6a6] text-center">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Earnings</th>
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
              </tr>
            </tbody>
          </table>
        </div>

        {/* Statistics Section */}
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between">
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
