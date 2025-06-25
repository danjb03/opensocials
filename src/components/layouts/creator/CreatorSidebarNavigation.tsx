
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Briefcase, 
  User,
  DollarSign
} from 'lucide-react';
import { useRoutePreloader } from '@/hooks/useRoutePreloader';

interface CreatorSidebarNavigationProps {
  isSidebarOpen?: boolean;
}

const CreatorSidebarNavigation: React.FC<CreatorSidebarNavigationProps> = ({ isSidebarOpen = true }) => {
  const location = useLocation();
  const { preloadRoute } = useRoutePreloader();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/creator/dashboard', 
      icon: LayoutDashboard,
      preloadKey: '/creator/dashboard' as const
    },
    { 
      name: 'Analytics', 
      href: '/creator/analytics', 
      icon: BarChart3,
      preloadKey: '/creator/analytics' as const
    },
    { 
      name: 'Campaigns', 
      href: '/creator/campaigns', 
      icon: Briefcase,
      preloadKey: '/creator/campaigns' as const
    },
    { 
      name: 'Deals', 
      href: '/creator/deals', 
      icon: DollarSign,
      preloadKey: '/creator/deals' as const
    },
    { 
      name: 'Profile', 
      href: '/creator/profile', 
      icon: User,
      preloadKey: '/creator/profile' as const
    },
  ];

  const isActive = (href: string) => {
    if (href === '/creator/dashboard') {
      return location.pathname === '/creator' || location.pathname === '/creator/dashboard';
    }
    return location.pathname === href;
  };

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onMouseEnter={() => preloadRoute(item.preloadKey)}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${active 
                ? 'bg-white text-black' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <Icon 
              className={`${isSidebarOpen ? 'mr-3' : ''} h-5 w-5 ${active ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} 
            />
            {isSidebarOpen && item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default CreatorSidebarNavigation;
