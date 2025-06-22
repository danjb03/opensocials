
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
    <Sidebar collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className="px-6 py-6 flex items-center justify-start min-h-[80px] border-b border-sidebar-border">
        <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
          <SidebarLogo />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-sidebar-foreground text-lg">OS Platform</h2>
            <p className="text-sm text-sidebar-foreground/60">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-0">
        <SidebarGroup className="px-0">
          <SidebarMenu className="space-y-1 px-4">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  isActive={item.isActive}
                  className="h-auto min-h-[60px] py-3 px-4 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground rounded-lg"
                  tooltip={item.title}
                >
                  <Link to={item.url} className="flex items-center gap-4 w-full">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex flex-col items-start flex-1 group-data-[collapsible=icon]:hidden">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sidebar-foreground">{item.title}</span>
                        {item.notificationCount && item.notificationCount > 0 && (
                          <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 font-medium">
                            {item.notificationCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-sidebar-foreground/60 text-left">{item.description}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-6 py-4 border-t border-sidebar-border">
        <div className="text-sm text-sidebar-foreground/70 mb-3 truncate group-data-[collapsible=icon]:hidden">
          <div className="font-medium">Admin Account</div>
          <div className="text-xs">{userEmail}</div>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleSignOut}
          className="w-full h-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:text-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors bg-sidebar-accent text-sidebar-accent-foreground"
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
