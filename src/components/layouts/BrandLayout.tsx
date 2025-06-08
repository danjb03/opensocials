
import { useState, memo, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBrandAuth } from '@/hooks/useUnifiedAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, Search, Package, Calendar, Settings, BarChart2 } from 'lucide-react';
import SidebarToggle from './SidebarToggle';
import Footer from './Footer';

interface BrandLayoutProps {
  children: React.ReactNode;
}

const BrandLayout = memo(({ children }: BrandLayoutProps) => {
  const { user, profile } = useBrandAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => 
    localStorage.getItem('brand-sidebar-collapsed') === 'true'
  );

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
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
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = useMemo(() => {
    return () => {
      const newCollapsed = !isSidebarCollapsed;
      setIsSidebarCollapsed(newCollapsed);
      localStorage.setItem('brand-sidebar-collapsed', newCollapsed.toString());
    };
  }, [isSidebarCollapsed]);

  // Mobile layout adjustments
  const sidebarWidth = isMobile ? (isSidebarCollapsed ? 'w-0' : 'w-64') : (isSidebarCollapsed ? 'w-16' : 'w-64');
  const sidebarPosition = isMobile ? 'fixed' : 'relative';

  return (
    <div className="min-h-screen flex w-full">
      <aside className={`${sidebarPosition} ${sidebarWidth} bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out ${
        isMobile && !isSidebarCollapsed ? 'z-50 animate-slide-in-right' : ''
      } ${isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
        <SidebarToggle 
          isCollapsed={isSidebarCollapsed} 
          onClick={toggleSidebar}
        />
        
        <div className="p-4 flex flex-col h-full">
          <div className="mb-6">
            <Logo className={isSidebarCollapsed ? 'hidden' : 'block animate-fade-in'} />
          </div>
          
          <nav className="space-y-1 flex-1">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 transition-all duration-200 hover:scale-105 group" asChild>
              <Link to="/brand" className="flex items-center gap-3">
                <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 transition-all duration-200 hover:scale-105 group" asChild>
              <Link to="/brand/projects" className="flex items-center gap-3">
                <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!isSidebarCollapsed && <span>Projects</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 transition-all duration-200 hover:scale-105 group" asChild>
              <Link to="/brand/creators" className="flex items-center gap-3">
                <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!isSidebarCollapsed && <span>Find Creators</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 transition-all duration-200 hover:scale-105 group" asChild>
              <Link to="/brand/orders" className="flex items-center gap-3">
                <Package className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!isSidebarCollapsed && <span>Campaigns</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 transition-all duration-200 hover:scale-105 group" asChild>
              <Link to="/brand/analytics" className="flex items-center gap-3">
                <BarChart2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!isSidebarCollapsed && <span>Analytics</span>}
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 transition-all duration-200 hover:scale-105 group" asChild>
              <Link to="/brand/setup-profile" className="flex items-center gap-3">
                <Settings className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!isSidebarCollapsed && <span>Profile Setup</span>}
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            {!isSidebarCollapsed && (
              <div className="text-sm opacity-70 mb-2 truncate animate-fade-in">
                {profile?.company_name || user?.email}
              </div>
            )}
            <Button 
              variant="default" 
              onClick={handleSignOut} 
              disabled={isLoggingOut}
              className="w-full h-12 transition-all duration-200"
            >
              {isLoggingOut ? (
                <div className="animate-spin-slow">...</div>
              ) : (
                isSidebarCollapsed ? "Out" : "Sign Out"
              )}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={toggleSidebar}
        />
      )}
      
      <main className="flex-1 bg-background overflow-auto flex flex-col min-w-0">
        <div className="flex-1 animate-fade-in">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
});

BrandLayout.displayName = 'BrandLayout';

export default BrandLayout;
