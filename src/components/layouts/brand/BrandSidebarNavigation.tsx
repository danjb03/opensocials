
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings 
} from 'lucide-react';

interface BrandSidebarNavigationProps {
  isSidebarOpen: boolean;
}

const BrandSidebarNavigation = ({ isSidebarOpen }: BrandSidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/brand/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview and metrics'
    },
    { 
      name: 'Orders', 
      href: '/brand/orders', 
      icon: FolderOpen,
      description: 'Campaign pipeline'
    },
    { 
      name: 'Creators', 
      href: '/brand/creators', 
      icon: Users,
      description: 'Find and manage creators'
    },
    { 
      name: 'Settings', 
      href: '/brand/settings', 
      icon: Settings,
      description: 'Account preferences'
    }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
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
  );
};

export default BrandSidebarNavigation;
