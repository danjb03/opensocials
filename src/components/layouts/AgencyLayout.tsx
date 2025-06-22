
import { memo, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SidebarLogo from "@/components/ui/sidebar-logo";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAgencyAuth } from '@/hooks/useUnifiedAuth';
import { Home, Users, Settings, BarChart2, LogOut, ArrowLeft, Plus } from 'lucide-react';
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

interface AgencyLayoutProps {
  children: React.ReactNode;
}

const AgencyLayout = memo(({ children }: AgencyLayoutProps) => {
  const { user, role } = useAgencyAuth();
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
      description: "Overview and metrics",
      url: "/agency",
      icon: Home,
      isActive: isActiveRoute('/agency', true)
    },
    {
      title: "Orders",
      description: "Campaign pipeline",
      url: "/agency/orders",
      icon: BarChart2,
      isActive: isActiveRoute('/agency/orders')
    },
    {
      title: "User Management",
      description: "Manage agency users",
      url: "/agency/users",
      icon: Users,
      isActive: isActiveRoute('/agency/users')
    },
    {
      title: "CRM",
      description: "Client relationship management",
      url: "/agency/crm",
      icon: Settings,
      isActive: isActiveRoute('/agency/crm')
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon" className="border-r border-border bg-black">
          <SidebarHeader className="p-6 flex flex-col items-center justify-center min-h-[120px] border-b border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <SidebarLogo className="group-data-[collapsible=icon]:scale-75" />
              <div className="group-data-[collapsible=icon]:hidden">
                <h1 className="text-white text-xl font-semibold">OS Platform</h1>
                <p className="text-gray-400 text-sm">Agency Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          {role === 'super_admin' && (
            <div className="p-4 border-b border-gray-800 group-data-[collapsible=icon]:hidden">
              <Button 
                variant="outline" 
                onClick={() => navigate('/super-admin')}
                className="w-full flex items-center gap-2 bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Super Admin
              </Button>
            </div>
          )}

          <div className="p-4 border-b border-gray-800 group-data-[collapsible=icon]:hidden">
            <Button 
              className="w-full flex items-center gap-2 bg-white text-black hover:bg-gray-200"
              onClick={() => navigate('/agency/create-campaign')}
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>
          
          <SidebarContent className="px-4 py-6">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.isActive}
                    className={`
                      h-auto p-4 rounded-lg transition-colors group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-3
                      ${item.isActive 
                        ? 'bg-gray-900 text-white border border-gray-700' 
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                      }
                    `}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-start gap-4 w-full">
                      <item.icon className="h-6 w-6 mt-1 flex-shrink-0" />
                      <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                        <div className="font-medium text-base">{item.title}</div>
                        <div className="text-sm opacity-70 mt-1">{item.description}</div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-gray-800">
            <div className="text-sm text-gray-400 mb-3 truncate group-data-[collapsible=icon]:hidden">
              {user?.email}
            </div>
            <Button 
              variant="secondary" 
              onClick={handleSignOut}
              className="w-full h-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
            >
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
              <LogOut className="hidden group-data-[collapsible=icon]:block h-4 w-4" />
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex flex-col flex-1">
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

AgencyLayout.displayName = 'AgencyLayout';

export default AgencyLayout;
