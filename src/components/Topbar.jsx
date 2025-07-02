import { Link } from 'react-router-dom';

function Topbar() {
  return (
    <div className="bg-[#89AE29] text-white px-6 py-3 mx-4 mt-4 rounded-full shadow-lg flex justify-between items-center">
      <div className="text-lg font-semibold">USERNAME</div>
      <div className="space-x-6 text-sm">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/products" className="hover:underline">Products</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
      </div>
    </div>
  );
}

export default Topbar;
