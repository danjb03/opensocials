
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Navigate, Outlet } from 'react-router-dom';
import { UserCircle, Users, PackageOpen, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const AdminLayout = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();

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
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
            <Link to="/admin/users" className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
            <Link to="/admin/creators" className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Creator Management
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
            <Link to="/admin/orders" className="flex items-center gap-2">
              <PackageOpen className="h-5 w-5" />
              Order Management
            </Link>
          </Button>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-slate-700">
          <div className="text-sm opacity-70">
            Logged in as {role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-background overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
