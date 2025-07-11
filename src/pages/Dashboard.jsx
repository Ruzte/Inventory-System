import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleActionChange = (action) => {
  switch(action) {
    case 'edit':
      // Handle edit action
      console.log('Edit selected');
      break;
    case 'delete':
      // Handle delete action
      console.log('Delete selected');
      break;
    case 'view':
      // Handle view action
      console.log('View selected');
      break;
    default:
      break;
    }
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Inventory Section */}
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#89AE29] ">PRODUCTS</h2>
            <button
              type="button"
              className="inline-block hover:scale-105 transition-transform duration-200 border px-3 py-1 rounded-md text-sm text-[#FEF5E3] bg-[#89AE29]"
              onClick={() => navigate('/history')}
            >
              Transaction History
            </button>
          </div>
          <table className="w-full text-xs font-normal text-[#2F5D55] font-inter border border-gray-300">
            <thead className="bg-[#dbe6a6] text-center">
              <tr>
                <th className="p-2 border w-24">Date Added</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border w-24">Points</th>
                <th className="p-2 border w-24">Price</th>
                <th className="p-2 border w-24">Unit</th>
                <th className="p-2 border w-24">Total Points</th>
                <th className="p-2 border w-24">Total Price</th>
                <th className="p-2 border w-20">Action</th>
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
                <td className="p-2 border">
                  <select 
                    className="min-w-8 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#89AE29]"
                    onChange={(e) => handleActionChange(e.target.value)}
                  >
                    <option value="">Select Action</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                    <option value="view">View Details</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Statistics Section */}
        <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between ">
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
