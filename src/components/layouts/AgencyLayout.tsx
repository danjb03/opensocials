
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import Logo from "@/components/ui/logo";
import { useToast } from '@/hooks/use-toast';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { UserCircle, Users, PackageOpen, LayoutDashboard, FileText, Briefcase, BarChart, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import SidebarToggle from './SidebarToggle';
import Footer from './Footer';

const AgencyLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, role } = useUnifiedAuth();
  const { toast } = useToast();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!user || (role !== 'agency' && role !== 'super_admin')) {
    toast({
      title: 'Access Denied',
      description: 'Only agency users can access this page.',
      variant: 'destructive',
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      <aside className={`relative bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <SidebarToggle 
          isCollapsed={isSidebarCollapsed} 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <div className="p-4 flex flex-col h-full">
          <div className="mb-6">
            <Logo className={isSidebarCollapsed ? 'hidden' : 'block'} />
          </div>
          
          <nav className="space-y-1 flex-1">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/users" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {!isSidebarCollapsed && <span>User Management</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/invite" className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Invite Users</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/projects" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Project Management</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/orders" className="flex items-center gap-2">
                <PackageOpen className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Order Management</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/crm/brands" className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Brand CRM</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/crm/creators" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Creator CRM</span>}
              </Link>
            </Button>

            {!isSidebarCollapsed && (
              <div className="px-4 py-2 text-xs text-muted-foreground uppercase mt-4">Insights</div>
            )}

            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/crm/creators/leaderboard" className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Creator Leaderboard</span>}
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/crm/brands/leaderboard" className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Brand Leaderboard</span>}
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/agency/crm/deals" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Deal Pipeline</span>}
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            {!isSidebarCollapsed && (
              <div className="text-sm opacity-70">
                Logged in as Agency
              </div>
            )}
          </div>
        </div>
      </aside>
      
      <main className="flex-1 bg-background overflow-auto flex flex-col">
        <div className="flex-1">
          {children || <Outlet />}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AgencyLayout;
