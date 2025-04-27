
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Navigate, Outlet } from 'react-router-dom';
import { UserCircle, Users, PackageOpen, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useState } from 'react';
import SidebarToggle from './SidebarToggle';

const AdminLayout = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!user || (role !== 'admin' && role !== 'super_admin')) {
    toast({
      title: 'Access Denied',
      description: 'Only admins can access this page.',
      variant: 'destructive',
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      <aside className={`relative bg-slate-800 text-white transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <SidebarToggle 
          isCollapsed={isSidebarCollapsed} 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <div className="p-4 flex flex-col h-full">
          <div className="mb-6">
            <h1 className={`text-xl font-bold ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
              Admin Dashboard
            </h1>
          </div>
          
          <nav className="space-y-1 flex-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
              <Link to="/admin/users" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {!isSidebarCollapsed && <span>User Management</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
              <Link to="/admin/creators" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Creator Management</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
              <Link to="/admin/orders" className="flex items-center gap-2">
                <PackageOpen className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Order Management</span>}
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-slate-700">
            {!isSidebarCollapsed && (
              <div className="text-sm opacity-70">
                Logged in as {role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </div>
            )}
          </div>
        </div>
      </aside>
      
      <main className="flex-1 bg-background overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
