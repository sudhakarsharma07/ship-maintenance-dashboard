import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">ENTNT Dashboard</div>
      <div className="flex items-center gap-4">
        {currentUser && (
          <span className="text-gray-700 flex items-center gap-2 text-sm">
            <FaUserCircle className="text-xl" />
            {currentUser.email} ({currentUser.role})
          </span>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded text-sm transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
