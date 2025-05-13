
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChartLine, DollarSign, FileText, User } from 'lucide-react';
import SidebarToggle from './SidebarToggle';
import Footer from './Footer';

interface CreatorLayoutProps {
  children: React.ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                location.pathname === '/creator' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Profile</span>}
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                location.pathname === '/creator/analytics' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator/analytics" className="flex items-center gap-2">
                <ChartLine className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Analytics</span>}
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                location.pathname === '/creator/deals' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator/deals" className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Deals</span>}
              </Link>
            </Button>

            <Button 
              variant="ghost" 
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                location.pathname.startsWith('/creator/campaigns') ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              }`}
              asChild
            >
              <Link to="/creator/campaigns" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Campaigns</span>}
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            {!isSidebarCollapsed && (
              <div className="text-sm opacity-70 mb-2">
                Logged in as {user?.email}
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

export default CreatorLayout;
