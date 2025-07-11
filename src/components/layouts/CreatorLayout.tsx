
import React from 'react';
import { Outlet } from 'react-router-dom';
import CreatorSidebar from './creator/CreatorSidebar';

const CreatorLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <CreatorSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/95">
          <div className="min-h-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorLayout;
