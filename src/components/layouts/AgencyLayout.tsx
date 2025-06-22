
import React from 'react';
import { Outlet } from 'react-router-dom';
import AgencySidebar from './agency/AgencySidebar';

const AgencyLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <AgencySidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
