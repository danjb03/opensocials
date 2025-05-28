
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChartLine, DollarSign, FileText, User, Menu, X } from 'lucide-react';
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

  const navigationItems = [
    {
      title: 'Profile',
      icon: User,
      path: '/creator',
      isActive: location.pathname === '/creator'
    },
    {
      title: 'Analytics',
      icon: ChartLine,
      path: '/creator/analytics',
      isActive: location.pathname === '/creator/analytics'
    },
    {
      title: 'Deals',
      icon: DollarSign,
      path: '/creator/deals',
      isActive: location.pathname === '/creator/deals'
    },
    {
      title: 'Campaigns',
      icon: FileText,
      path: '/creator/campaigns',
      isActive: location.pathname.startsWith('/creator/campaigns')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`relative bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <Logo className="h-8" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
            >
              {isSidebarCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          {!isSidebarCollapsed && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={handleSignOut} 
            disabled={isLoggingOut}
            size="sm"
            className="w-full justify-center border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {isLoggingOut ? "..." : isSidebarCollapsed ? "Out" : "Sign Out"}
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default CreatorLayout;
