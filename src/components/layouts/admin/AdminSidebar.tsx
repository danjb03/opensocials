import { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { getAdminMenuItems } from './AdminMenuItems';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface AdminSidebarProps {
  userEmail?: string;
  role: string;
  isActiveRoute: (path: string, exact?: boolean) => boolean;
  pendingCount?: number;
}

const AdminSidebar = memo(({ userEmail, role, isActiveRoute, pendingCount = 0 }: AdminSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role: userRole } = useUnifiedAuth();

  useEffect(() => {
    localStorage.setItem('admin-sidebar-open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = getAdminMenuItems(isActiveRoute, pendingCount);

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">OS</span>
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-sm">OS Platform</h2>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="p-2 h-8 w-8"
          >
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Super Admin Back Button */}
      {userRole === 'super_admin' && isSidebarOpen && (
        <div className="p-4 border-b border-border">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/super_admin')}
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Super Admin
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;
            
            return (
              <li key={item.title}>
                <Button
                  variant="ghost"
                  onClick={() => navigate(item.url)}
                  className={`w-full justify-start h-auto p-3 rounded-lg ${
                    isActive 
                      ? 'bg-white text-black hover:bg-white hover:text-black' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
                  {isSidebarOpen && (
                    <div className="text-left">
                      <div className="flex items-center justify-between w-full">
                        <div className="font-medium text-sm">{item.title}</div>
                        {item.notificationCount && item.notificationCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium min-w-[20px] text-center ml-2">
                            {item.notificationCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {isSidebarOpen && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin Account</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
