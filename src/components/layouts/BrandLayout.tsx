
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Home, Search, Package } from 'lucide-react';
import SidebarToggle from './SidebarToggle';

interface BrandLayoutProps {
  children: React.ReactNode;
}

const BrandLayout = ({ children }: BrandLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
      <aside className={`relative bg-slate-800 text-white transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <SidebarToggle 
          isCollapsed={isSidebarCollapsed} 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <div className="p-4 flex flex-col h-full">
          <div className="mb-6">
            <h1 className={`text-xl font-bold ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
              Brand Portal
            </h1>
          </div>
          
          <nav className="space-y-1 flex-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
              <Link to="/brand" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
              <Link to="/brand/creators" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Find Creators</span>}
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
              <Link to="/brand/orders" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {!isSidebarCollapsed && <span>Orders</span>}
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-slate-700">
            {!isSidebarCollapsed && (
              <div className="text-sm opacity-70 mb-2">
                Logged in as {user?.email}
              </div>
            )}
            <Button 
              variant="destructive" 
              onClick={handleSignOut} 
              disabled={isLoggingOut}
              className="w-full"
            >
              {isLoggingOut ? "..." : isSidebarCollapsed ? "Out" : "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default BrandLayout;
