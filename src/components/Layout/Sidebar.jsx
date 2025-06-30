import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/roleUtils';
import { FaTachometerAlt, FaShip, FaTools, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const { currentUser } = useAuth();

  const links = [
    { to: '/dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/ships', text: 'Ships', icon: <FaShip /> },
    { to: '/jobs', text: 'Maintenance Jobs', icon: <FaTools /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <div className="text-3xl font-bold text-blue-600 mb-8 text-center tracking-wide">ENTNT</div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map(({ to, text, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-4 rounded text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {icon}
                {text}
              </NavLink>
            </li>
          ))}

          {/* Optional admin-only link */}
          {currentUser?.role === ROLES.ADMIN && (
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-4 rounded text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <FaCog /> Admin Settings
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
