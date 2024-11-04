// ./src/components/SettingsSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const SettingsSidebar = () => {
  return (
    <div className="w-64 p-4 bg-white border-r">
      <h2 className="text-lg font-semibold mb-6">Settings</h2>
      <nav className="space-y-4 flex flex-col">
        <NavLink
          to="academic-year"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-medium' : 'text-gray-700'
          }
        >
          Academic Year
        </NavLink>
        <NavLink
          to="admin-account"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-medium' : 'text-gray-700'
          }
        >
          Admin Account
        </NavLink>
        <NavLink
          to="invalid-accounts"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-medium' : 'text-gray-700'
          }
        >
          Student Accounts
        </NavLink>
      </nav>
    </div>
  );
};

export default SettingsSidebar;
