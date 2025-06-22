
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
    <Sidebar collapsible="icon" className="bg-black border-r border-gray-800">
      <SidebarHeader className="px-6 py-6 flex items-center justify-start min-h-[80px] border-b border-gray-800">
        <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
          <SidebarLogo />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-white text-lg">OS Platform</h2>
            <p className="text-sm text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-4">
        <SidebarGroup className="px-0">
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  isActive={item.isActive}
                  className={`h-auto min-h-[64px] py-4 px-4 rounded-xl transition-all duration-200 ${
                    item.isActive 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white'
                  }`}
                  tooltip={item.title}
                >
                  <Link to={item.url} className="flex items-center gap-4 w-full">
                    <item.icon className="h-6 w-6 flex-shrink-0" />
                    <div className="flex flex-col items-start flex-1 group-data-[collapsible=icon]:hidden">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-base">{item.title}</span>
                        {item.notificationCount && item.notificationCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium min-w-[20px] text-center">
                            {item.notificationCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-400 text-left mt-1">{item.description}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-6 py-6 border-t border-gray-800">
        <div className="text-sm text-gray-400 mb-4 truncate group-data-[collapsible=icon]:hidden">
          <div className="font-medium text-white mb-1">Admin Account</div>
          <div className="text-xs text-gray-400">{userEmail}</div>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleSignOut}
          className="w-full h-12 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border-0 font-medium"
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
