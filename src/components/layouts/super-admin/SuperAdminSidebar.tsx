
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarLogo from "@/components/ui/sidebar-logo";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, LayoutDashboard, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SuperAdminSidebarProps {
  userEmail?: string;
  role: string;
  isActiveRoute: (path: string, exact?: boolean) => boolean;
}

const SuperAdminSidebar = memo(({ userEmail, role, isActiveRoute }: SuperAdminSidebarProps) => {
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

  const menuItems = [
    {
      title: 'Overview',
      url: '/super_admin',
      icon: LayoutDashboard,
      isActive: isActiveRoute('/super_admin', true)
    },
    {
      title: 'Agencies',
      url: '/super_admin/users/agencies',
      icon: Users,
      isActive: isActiveRoute('/super_admin/users/agencies')
    },
    {
      title: 'Brands',
      url: '/super_admin/users/brands',
      icon: Users,
      isActive: isActiveRoute('/super_admin/users/brands')
    },
    {
      title: 'Creators',
      url: '/super_admin/users/creators',
      icon: Users,
      isActive: isActiveRoute('/super_admin/users/creators')
    }
  ];

  return (
    <Sidebar collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex items-center justify-center min-h-[80px]">
        <SidebarLogo className="group-data-[collapsible=icon]:scale-75" />
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                isActive={item.isActive}
                className="h-12 mr-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-3 w-full">
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
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
          variant="default" 
          onClick={handleSignOut}
          className="w-full h-12 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          <LogOut className="hidden group-data-[collapsible=icon]:block h-4 w-4" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
});

SuperAdminSidebar.displayName = 'SuperAdminSidebar';

export default SuperAdminSidebar;
