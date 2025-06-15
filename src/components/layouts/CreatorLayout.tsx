
import { memo, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SidebarLogo from "@/components/ui/sidebar-logo";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { Home, Calendar, DollarSign, FileText, User, BarChart2, LogOut, ArrowLeft } from 'lucide-react';
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

interface CreatorLayoutProps {
  children: React.ReactNode;
}

const CreatorLayout = memo(({ children }: CreatorLayoutProps) => {
  const { user, profile, role } = useCreatorAuth();
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
      url: "/creator",
      icon: Home,
      isActive: isActiveRoute('/creator', true)
    },
    {
      title: "Campaigns",
      url: "/creator/campaigns", 
      icon: Calendar,
      isActive: isActiveRoute('/creator/campaigns')
    },
    {
      title: "Deals",
      url: "/creator/deals",
      icon: DollarSign,
      isActive: isActiveRoute('/creator/deals')
    },
    {
      title: "Analytics",
      url: "/creator/analytics",
      icon: BarChart2,
      isActive: isActiveRoute('/creator/analytics')
    },
    {
      title: "Profile",
      url: "/creator/profile",
      icon: User,
      isActive: isActiveRoute('/creator/profile')
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
            {role === 'super_admin' && (
              <div className="ml-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/super-admin')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Super Admin Dashboard
                </Button>
              </div>
            )}
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

CreatorLayout.displayName = 'CreatorLayout';

export default CreatorLayout;
