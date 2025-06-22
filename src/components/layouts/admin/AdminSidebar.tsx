
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';
import { getAdminMenuItems } from './AdminMenuItems';
import SidebarLogo from '@/components/ui/sidebar-logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  userEmail?: string;
  role: string;
  isActiveRoute: (path: string, exact?: boolean) => boolean;
  pendingCount?: number;
}

const AdminSidebar = memo(({ userEmail, role, isActiveRoute, pendingCount = 0 }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const menuItems = getAdminMenuItems(isActiveRoute, pendingCount);

  return (
    <Sidebar collapsible="icon" className="bg-card border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">OS</span>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-semibold text-foreground text-sm">OS Platform</h2>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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
                    className={`w-full justify-start h-auto p-3 ${
                      isActive 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${!isActive ? 'mr-3' : 'mr-3'} group-data-[collapsible=icon]:mr-0`} />
                    <div className="text-left group-data-[collapsible=icon]:hidden">
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
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border group-data-[collapsible=icon]:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Admin Account</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
