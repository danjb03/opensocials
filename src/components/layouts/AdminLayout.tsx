
import { memo, useMemo } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { usePendingCampaignReviews } from '@/hooks/admin/usePendingCampaignReviews';
import Footer from './Footer';
import AdminSidebar from './admin/AdminSidebar';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = memo(({ children }: AdminLayoutProps) => {
  const { user, role } = useUnifiedAuth();
  const location = useLocation();
  const { data: pendingCount = 0 } = usePendingCampaignReviews();

  const isActiveRoute = useMemo(() => {
    return (path: string, exact = false) => {
      if (exact) {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar 
        userEmail={user?.email}
        role={role}
        isActiveRoute={isActiveRoute}
        pendingCount={pendingCount}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
        
        <Footer />
      </div>
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
