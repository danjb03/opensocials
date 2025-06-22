
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  Menu, 
  X,
  Search,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const CreatorLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('creator-sidebar-open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, creatorProfile, role } = useUnifiedAuth();

  useEffect(() => {
    localStorage.setItem('creator-sidebar-open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/creator/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    { 
      name: 'Campaigns', 
      href: '/creator/campaigns', 
      icon: FolderOpen,
      description: 'Active projects'
    },
    { 
      name: 'Invitations', 
      href: '/creator/invitations', 
      icon: Heart,
      description: 'Brand invitations'
    },
    { 
      name: 'Analytics', 
      href: '/creator/analytics', 
      icon: Search,
      description: 'Performance insights'
    },
    { 
      name: 'Settings', 
      href: '/creator/settings', 
      icon: Settings,
      description: 'Account preferences'
    }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">OS</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground text-sm">OS Platform</h2>
                  <p className="text-xs text-muted-foreground">Creator Dashboard</p>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="p-2 h-8 w-8"
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Super Admin Back Button */}
        {role === 'super_admin' && isSidebarOpen && (
          <div className="p-4 border-b border-border">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/super_admin')}
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Super Admin
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-border">
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/creator/invitations')}
                className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                <Heart className="h-4 w-4 mr-2" />
                View Invitations
              </Button>
              <Button 
                onClick={() => navigate('/creator/analytics')}
                variant="outline" 
                className="w-full justify-start"
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(item.href)}
                    className={`w-full justify-start h-auto p-3 ${
                      isActive 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
                    {isSidebarOpen && (
                      <div className="text-left">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {creatorProfile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'C'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {creatorProfile?.first_name ? `${creatorProfile.first_name} ${creatorProfile.last_name || ''}` : 'Creator Account'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default CreatorLayout;
