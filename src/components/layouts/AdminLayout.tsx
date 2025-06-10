
import { memo, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SidebarLogo from "@/components/ui/sidebar-logo";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useUnifiedAuth';
import { Home, Users, Settings, Shield, FileText, BarChart2, LogOut } from 'lucide-react';
import Footer from './Footer';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = memo(({ children }: AdminLayoutProps) => {
  const { user, profile } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

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

  const isActiveRoute = useMemo(() => {
    return (path: string, exact = false) => {
      if (exact) {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    };
  }, [location.pathname]);

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
      isActive: isActiveRoute('/admin', true)
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
      isActive: isActiveRoute('/admin/users')
    },
    {
      title: "CRM",
      url: "/admin/crm",
      icon: BarChart2,
      isActive: isActiveRoute('/admin/crm')
    },
    {
      title: "Projects",
      url: "/admin/projects", 
      icon: FileText,
      isActive: isActiveRoute('/admin/projects')
    },
    {
      title: "Security",
      url: "/admin/security",
      icon: Shield,
      isActive: isActiveRoute('/admin/security')
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
      isActive: isActiveRoute('/admin/settings')
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
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
                    <Link to={item.url} className="flex items-center gap-3">
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
              {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}
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
        
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" />
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
