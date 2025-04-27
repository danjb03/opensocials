
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Home, Search, Package, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-800 text-white p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Brand Portal</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
            <Link to="/brand" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
            <Link to="/brand/creators" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Creators
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700" asChild>
            <Link to="/brand/orders" className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Orders
            </Link>
          </Button>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-slate-700">
          <div className="text-sm opacity-70 mb-2">
            Logged in as {user?.email}
          </div>
          <Button 
            variant="destructive" 
            onClick={handleSignOut} 
            disabled={isLoggingOut}
            className="w-full"
          >
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default BrandLayout;
