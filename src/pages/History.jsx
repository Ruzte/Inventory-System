function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Inventory Section */}
        <div className="col-span-3 bg-[#FEF5E3] p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#89AE29] ">TRANSACTION HISTORY</h2>
          </div>
          <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
            <thead className="bg-[#dbe6a6] text-center">
              <tr>
                <th className="p-2 border">Date Added</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Points</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Unit</th>
                <th className="p-2 border">Total Points</th>
                <th className="p-2 border">Total Price</th>
                <th className="p-2 border">Date Sold</th>
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
                <td className="p-2 border">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
