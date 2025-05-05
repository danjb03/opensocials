
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBrandProfile } from '@/hooks/useBrandProfile';
import { Home, Search, Package, Calendar, Settings, BarChart2 } from 'lucide-react';
import SidebarToggle from './SidebarToggle';
import Footer from './Footer';

interface BrandLayoutProps {
  children: React.ReactNode;
}

const BrandLayout = ({ children }: BrandLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useBrandProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  return (
    <div className="min-h-screen flex">
      <aside className={`relative bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <SidebarToggle 
          isCollapsed={isSidebarCollapsed} 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <div className="p-4 flex flex-col h-full">
          <div className="mb-6">
            <Logo className={isSidebarCollapsed ? 'hidden' : 'block'} />
          </div>
          
          <nav className="space-y-1 flex-1">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/brand" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/brand/projects" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Projects</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/brand/creators" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Find Creators</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/brand/orders" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Campaigns</span>}
              </Link>
            </Button>
            
            {/* Add Analytics link */}
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/brand/analytics" className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Analytics</span>}
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" asChild>
              <Link to="/brand/setup-profile" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Profile Setup</span>}
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            {!isSidebarCollapsed && (
              <div className="text-sm opacity-70 mb-2">
                {profile?.company_name || user?.email}
              </div>
            )}
            <Button 
              variant="default" 
              onClick={handleSignOut} 
              disabled={isLoggingOut}
              className="w-full"
            >
              {isLoggingOut ? "..." : isSidebarCollapsed ? "Out" : "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 bg-background overflow-auto flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default BrandLayout;
