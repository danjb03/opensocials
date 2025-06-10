
import { useState, memo, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AccessibleButton } from "@/components/ui/accessible-button";
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

  const navigationItems = [
    { to: "/brand", icon: Home, label: "Dashboard" },
    { to: "/brand/projects", icon: Calendar, label: "Projects" },
    { to: "/brand/creators", icon: Search, label: "Find Creators" },
    { to: "/brand/orders", icon: Package, label: "Campaigns" },
    { to: "/brand/analytics", icon: BarChart2, label: "Analytics" },
    { to: "/brand/setup-profile", icon: Settings, label: "Profile Setup" },
  ];

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
          
          <nav className="space-y-1 flex-1" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <AccessibleButton 
                key={item.to}
                variant="ghost" 
                className="w-full justify-start text-foreground hover:bg-sidebar-accent h-12 transition-all duration-200 hover:scale-105 group" 
                asChild
              >
                <Link 
                  to={item.to} 
                  className="flex items-center gap-3 text-foreground"
                  aria-label={isSidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {!isSidebarCollapsed && <span className="text-foreground">{item.label}</span>}
                </Link>
              </AccessibleButton>
            ))}
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            {!isSidebarCollapsed && (
              <div className="text-sm text-foreground/70 mb-2 truncate animate-fade-in">
                {profile?.company_name || user?.email}
              </div>
            )}
            <AccessibleButton 
              variant="default" 
              onClick={handleSignOut} 
              loading={isLoggingOut}
              loadingText="Signing out..."
              className="w-full h-12 bg-white text-black hover:bg-gray-100 hover:text-black"
              aria-label="Sign out of your account"
            >
              {isSidebarCollapsed && !isLoggingOut ? "Out" : null}
            </AccessibleButton>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={toggleSidebar}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleSidebar();
            }
          }}
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
