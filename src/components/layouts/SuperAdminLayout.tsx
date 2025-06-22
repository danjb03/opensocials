
import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import Footer from './Footer';
import SuperAdminSidebar from './super-admin/SuperAdminSidebar';
import SuperAdminHeader from './super-admin/SuperAdminHeader';
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout = memo(({ children }: SuperAdminLayoutProps) => {
  const { user, role } = useUnifiedAuth();
  const location = useLocation();

  const isActiveRoute = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SuperAdminSidebar 
          userEmail={user?.email}
          role={role}
          isActiveRoute={isActiveRoute}
        />
        
        <SidebarInset className="flex flex-col flex-1">
          <SuperAdminHeader role={role} />
          
          <main className="flex-1 overflow-auto p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
});

SuperAdminLayout.displayName = 'SuperAdminLayout';

export default SuperAdminLayout;
