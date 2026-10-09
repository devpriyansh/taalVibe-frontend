import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import BottomPlayer from '../components/layout/BottomPlayer';
import BottomNavigation from '../components/layout/BottomNavigation';

const RootLayout = () => {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-sonora-base text-sonora-text relative pt-safe">
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 relative z-0 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <div className="flex flex-col z-50">
        <BottomPlayer />
        <BottomNavigation />
      </div>
      
    </div>
  );
};

export default RootLayout;