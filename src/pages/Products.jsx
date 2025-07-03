function Dashboard() {
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
          <div className="flex justify-center">
            <div className="bg-[#E4DED0] p-4 rounded shadow text-center text-sm text-[#2F5D55] w-32 h-32 flex items-center justify-center">Add Photo</div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
