
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
      name: 'User Management', 
      href: '/agency/users', 
      icon: Users,
      description: 'Manage agency users'
    },
    { 
      name: 'CRM', 
      href: '/agency/crm', 
      icon: Settings,
      description: 'Client relationship management'
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

export default AgencySidebarNavigation;
