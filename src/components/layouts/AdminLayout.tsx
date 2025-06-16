
import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { usePendingCampaignReviews } from '@/hooks/admin/usePendingCampaignReviews';
import Footer from './Footer';
import AdminSidebar from './admin/AdminSidebar';
import AdminHeader from './admin/AdminHeader';
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar 
          userEmail={user?.email}
          role={role}
          isActiveRoute={isActiveRoute}
          pendingCount={pendingCount}
        />
        
        <SidebarInset className="flex flex-col">
          <AdminHeader role={role} />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
