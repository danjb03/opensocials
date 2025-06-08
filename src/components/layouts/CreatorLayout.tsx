
import { useState, memo, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChartLine, DollarSign, FileText, User } from 'lucide-react';
import SidebarToggle from './SidebarToggle';
import Footer from './Footer';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';

interface CreatorLayoutProps {
  children: React.ReactNode;
}

const CreatorLayout = memo(({ children }: CreatorLayoutProps) => {
  const { user } = useCreatorAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => 
    localStorage.getItem('creator-sidebar-collapsed') === 'true'
  );

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("There was an error signing out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = useMemo(() => {
    return () => {
      const newCollapsed = !isSidebarCollapsed;
      setIsSidebarCollapsed(newCollapsed);
      localStorage.setItem('creator-sidebar-collapsed', newCollapsed.toString());
    };
  }, [isSidebarCollapsed]);

  const isActiveRoute = useMemo(() => {
    return (path: string, exact = false) => {
      if (exact) {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    };
  }, [location.pathname]);

  // Mobile layout adjustments
  const sidebarWidth = isMobile ? (isSidebarCollapsed ? 'w-0' : 'w-64') : (isSidebarCollapsed ? 'w-16' : 'w-64');
  const sidebarPosition = isMobile ? 'fixed' : 'relative';

  return (
    <div className="min-h-screen flex w-full">
      <aside className={`${sidebarPosition} ${sidebarWidth} bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        isMobile && !isSidebarCollapsed ? 'z-50' : ''
      } ${isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
        <SidebarToggle 
          isCollapsed={isSidebarCollapsed} 
          onClick={toggleSidebar}
        />
        
        <div className="p-4 flex flex-col h-full">
          <div className="mb-6">
            <Logo className={isSidebarCollapsed ? 'hidden' : 'block'} />
          </div>
          
          <nav className="space-y-1 flex-1">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 ${
                isActiveRoute('/creator', true) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator" className="flex items-center gap-3">
                <User className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Profile</span>}
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 ${
                isActiveRoute('/creator/analytics') ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator/analytics" className="flex items-center gap-3">
                <ChartLine className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Analytics</span>}
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 ${
                isActiveRoute('/creator/deals') ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator/deals" className="flex items-center gap-3">
                <DollarSign className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Deals</span>}
              </Link>
            </Button>

            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-12 ${
                isActiveRoute('/creator/campaigns') ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator/campaigns" className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Campaigns</span>}
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            {!isSidebarCollapsed && (
              <div className="text-sm opacity-70 mb-2 truncate">
                Logged in as {user?.email}
              </div>
            )}
            <Button 
              variant="default" 
              onClick={handleSignOut} 
              disabled={isLoggingOut}
              className="w-full h-12"
            >
              {isLoggingOut ? "..." : isSidebarCollapsed ? "Out" : "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
      
      <main className="flex-1 bg-background overflow-auto flex flex-col min-w-0">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
});

CreatorLayout.displayName = 'CreatorLayout';

export default CreatorLayout;
