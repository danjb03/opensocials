
import React from 'react';
import { Outlet } from 'react-router-dom';
import BrandSidebar from './brand/BrandSidebar';

const BrandLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 flex w-full">
      <BrandSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default BrandLayout;
