import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-semibold text-gray-700">ENTNT Dashboard</div>
      <div>
        {currentUser && (
          <span className="text-gray-600 mr-4">
            Welcome, {currentUser.email} ({currentUser.role})
          </span>
        )}
        <button onClick={logout} className="btn btn-secondary text-sm">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;