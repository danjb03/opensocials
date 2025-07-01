
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Heart, 
  BarChart3,
  Settings 
} from 'lucide-react';

interface CreatorSidebarNavigationProps {
  isSidebarOpen: boolean;
}

const CreatorSidebarNavigation = ({ isSidebarOpen }: CreatorSidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/creator', 
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
      name: 'Deals', 
      href: '/creator/deals', 
      icon: Heart,
      description: 'Brand partnerships'
    },
    { 
      name: 'Analytics', 
      href: '/creator/analytics', 
      icon: BarChart3,
      description: 'Performance insights'
    },
    { 
      name: 'Profile', 
      href: '/creator/profile', 
      icon: Settings,
      description: 'Account settings'
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/creator') {
      return location.pathname === '/creator' || location.pathname === '/creator/dashboard';
    }
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
                className={`w-full justify-start h-auto p-3 rounded-lg ${
                  isActive 
                    ? 'bg-white text-black hover:bg-white hover:text-black' 
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

export default CreatorSidebarNavigation;
