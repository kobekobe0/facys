// ./src/pages/Settings.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import SettingsSidebar from '../components/SettingsSidebar';

const Settings = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <SettingsSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
