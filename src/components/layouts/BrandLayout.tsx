
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Home, Search, ShoppingCart } from 'lucide-react';

interface BrandLayoutProps {
  children: React.ReactNode;
}

const BrandLayout = ({ children }: BrandLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/brand" className="text-xl font-bold">Brand Dashboard</Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="hidden md:inline text-gray-600">{user.email}</span>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="container mx-auto px-4 py-2">
          <nav className="flex space-x-4">
            <Link to="/brand">
              <Button 
                variant={location.pathname === '/brand' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link to="/brand/creators">
              <Button 
                variant={location.pathname === '/brand/creators' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span>Find Creators</span>
              </Button>
            </Link>
            <Link to="/brand/orders">
              <Button 
                variant={location.pathname === '/brand/orders' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Brand Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BrandLayout;
