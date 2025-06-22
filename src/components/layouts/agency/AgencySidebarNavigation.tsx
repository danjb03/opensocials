
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings 
} from 'lucide-react';

interface AgencySidebarNavigationProps {
  isSidebarOpen: boolean;
}

const AgencySidebarNavigation = ({ isSidebarOpen }: AgencySidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/agency', 
      icon: LayoutDashboard,
      description: 'Overview and metrics'
    },
    { 
      name: 'Orders', 
      href: '/agency/orders', 
      icon: FolderOpen,
      description: 'Campaign pipeline'
    },
    { 
      name: 'Creators', 
      href: '/agency/crm/creators', 
      icon: Users,
      description: 'Find and manage creators'
    },
    { 
      name: 'Settings', 
      href: '/agency/settings', 
      icon: Settings,
      description: 'Account preferences'
    }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <li key={item.name}>
              <Button
                variant="ghost"
                onClick={() => navigate(item.href)}
                className={`w-full justify-start h-auto p-4 rounded-lg text-left ${
                  isActive 
                    ? 'bg-white text-black hover:bg-white hover:text-black' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <Icon className={`h-6 w-6 ${isSidebarOpen ? 'mr-4' : ''} flex-shrink-0`} />
                {isSidebarOpen && (
                  <div className="text-left">
                    <div className="font-medium text-lg leading-tight">{item.name}</div>
                    <div className="text-sm opacity-70 mt-1">{item.description}</div>
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

export default AgencySidebarNavigation;
