
import { memo, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChartLine, DollarSign, FileText, User } from 'lucide-react';
import Footer from './Footer';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
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
  const { user } = useCreatorAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("There was an error signing out. Please try again.");
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
      title: "Profile",
      url: "/creator",
      icon: User,
      isActive: isActiveRoute('/creator', true)
    },
    {
      title: "Analytics", 
      url: "/creator/analytics",
      icon: ChartLine,
      isActive: isActiveRoute('/creator/analytics')
    },
    {
      title: "Deals",
      url: "/creator/deals", 
      icon: DollarSign,
      isActive: isActiveRoute('/creator/deals')
    },
    {
      title: "Campaigns",
      url: "/creator/campaigns",
      icon: FileText,
      isActive: isActiveRoute('/creator/campaigns')
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <Logo />
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.isActive}
                    className="h-12"
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="text-sm text-sidebar-foreground/70 mb-2 truncate">
              {user?.email}
            </div>
            <Button 
              variant="default" 
              onClick={handleSignOut}
              className="w-full h-12"
            >
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger className="text-foreground hover:bg-accent" />
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
