import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import AdminSidebar from './admin/AdminSidebar';
import AdminHeader from './admin/AdminHeader';

const AdminLayout: React.FC = () => {
  const { user } = useUnifiedAuth();

  const isActiveRoute = (path: string, exact = false) => {
    return exact ? window.location.pathname === path : window.location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        userEmail={user?.email}
        role={user?.user_metadata?.role}
        isActiveRoute={isActiveRoute}
      />
      <div className="flex flex-col flex-1">
        <AdminHeader role={user?.user_metadata?.role} />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
