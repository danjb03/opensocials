
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, LayoutDashboard, Users, FileText, FolderOpen, UserCheck, Settings, Shield, MapPin, DollarSign } from 'lucide-react';
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

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: isActiveRoute('/admin', true)
    },
    {
      title: 'Campaign Review',
      url: '/admin/campaign-review',
      icon: FileText,
      isActive: isActiveRoute('/admin/campaign-review'),
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    {
      title: 'User Management',
      url: '/admin/user-management',
      icon: Users,
      isActive: isActiveRoute('/admin/user-management')
    },
    {
      title: 'Project Management',
      url: '/admin/project-management',
      icon: FolderOpen,
      isActive: isActiveRoute('/admin/project-management')
    },
    {
      title: 'Order Management',
      url: '/admin/order-management',
      icon: UserCheck,
      isActive: isActiveRoute('/admin/order-management')
    },
    {
      title: 'Platform Map',
      url: '/admin/platform-map',
      icon: MapPin,
      isActive: isActiveRoute('/admin/platform-map')
    },
    {
      title: 'Pricing Floors',
      url: '/admin/pricing-floors',
      icon: DollarSign,
      isActive: isActiveRoute('/admin/pricing-floors')
    },
    {
      title: 'Security',
      url: '/admin/security',
      icon: Shield,
      isActive: isActiveRoute('/admin/security')
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings,
      isActive: isActiveRoute('/admin/settings')
    }
  ];

  return (
    <Sidebar collapsible="icon" className="bg-background border-r border-border">
      <SidebarHeader className="p-4 flex items-center justify-center min-h-[80px] border-b border-border">
        <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">OS</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-foreground text-sm">OS Platform</h2>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
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
                className="h-12 mr-2 hover:bg-muted hover:text-foreground transition-colors"
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-3 w-full">
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1 group-data-[collapsible=icon]:hidden">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border">
        <div className="text-sm text-muted-foreground mb-2 truncate group-data-[collapsible=icon]:hidden">
          {userEmail}
        </div>
        <Button 
          variant="default" 
          onClick={handleSignOut}
          className="w-full h-12 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:text-xs hover:bg-muted hover:text-foreground transition-colors bg-foreground text-background"
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
