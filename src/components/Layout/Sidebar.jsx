import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/roleUtils';

const commonLinks = [
  { to: '/dashboard', text: 'Dashboard' },
  { to: '/ships', text: 'Ships' },
  { to: '/jobs', text: 'Maintenance Jobs' },
];

// Add role-specific links if needed, e.g., Admin settings page

const Sidebar = () => {
  const { currentUser } = useAuth();

  const activeClassName = "bg-blue-500 text-white";
  const inactiveClassName = "text-gray-600 hover:bg-gray-200 hover:text-gray-800";

  return (
    <aside className="w-64 bg-white shadow-lg p-4 space-y-2">
      <div className="text-2xl font-bold text-blue-600 mb-6 text-center">ENTNT</div>
      <nav>
        <ul>
          {commonLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => 
                  `block py-2.5 px-4 rounded transition duration-200 ${isActive ? activeClassName : inactiveClassName}`
                }
              >
                {link.text}
              </NavLink>
            </li>
          ))}
          {/* Example: Admin only link
          {currentUser?.role === ROLES.ADMIN && (
             <li>
              <NavLink to="/admin/settings" className={({ isActive }) => `block py-2.5 px-4 rounded transition duration-200 ${isActive ? activeClassName : inactiveClassName}`}>
                Admin Settings
              </NavLink>
            </li>
          )}
          */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;