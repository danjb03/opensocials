
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Graph, DollarSign } from 'lucide-react';

interface CreatorLayoutProps {
  children: React.ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
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
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/creator" className="text-xl font-bold">Creator Dashboard</Link>
          
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
        
        <div className="container mx-auto px-4 py-2">
          <nav className="flex space-x-4">
            <Link to="/creator">
              <Button 
                variant={location.pathname === '/creator' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Graph className="h-4 w-4" />
                <span>Overview</span>
              </Button>
            </Link>
            <Link to="/creator/deals">
              <Button 
                variant={location.pathname === '/creator/deals' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Deals</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Creator Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CreatorLayout;
