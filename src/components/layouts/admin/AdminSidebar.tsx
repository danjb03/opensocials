
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
    <Sidebar collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex items-center justify-center min-h-[80px] border-b border-sidebar-border">
        <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center">
          <SidebarLogo />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-sidebar-foreground text-sm">OS Platform</h2>
            <p className="text-xs text-sidebar-foreground/70">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                isActive={item.isActive}
                className="h-12 mr-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-3 w-full">
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  {item.notificationCount && item.notificationCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1 group-data-[collapsible=icon]:hidden font-medium">
                      {item.notificationCount}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="text-sm text-sidebar-foreground/70 mb-2 truncate group-data-[collapsible=icon]:hidden">
          {userEmail}
        </div>
        <Button 
          variant="secondary" 
          onClick={handleSignOut}
          className="w-full h-12 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:text-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors bg-sidebar-accent text-sidebar-accent-foreground"
        >
          <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          <LogOut className="hidden group-data-[collapsible=icon]:block h-4 w-4" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
