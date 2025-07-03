import { Link } from 'react-router-dom';

function Topbar() {
  return (
    <div className="bg-[#89AE29] text-white px-6 py-3 mx-4 mt-4 rounded-full shadow-lg flex justify-between items-center">
      <div className="text-lg font-semibold">USERNAME</div>
      <div className="space-x-6 text-sm">
        <Link
            to="/dashboard"
            className="inline-block text-white hover:scale-105 transition-transform duration-200"
        >
         Dashboard
        </Link>
        <Link
            to="/products"
            className="inline-block text-white hover:scale-105 transition-transform duration-200"
        >
        Products
        </Link>
        <Link
            to="/profile"
            className="inline-block text-white hover:scale-105 transition-transform duration-200"
        >
        Profile
        </Link>
        </div>
    </div>
  );
}

export default Topbar;
