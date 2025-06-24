import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Megaphone, Package, Users, Settings } from 'lucide-react';

const BrandSidebarNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/brand' && location.pathname === '/brand') return true;
    if (path !== '/brand' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="space-y-1 px-3">
      <Link
        to="/brand"
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive('/brand') && location.pathname === '/brand'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <BarChart3 className="mr-3 h-4 w-4" />
        Dashboard
      </Link>

      <Link
        to="/brand/campaigns"
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive('/brand/campaigns')
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Megaphone className="mr-3 h-4 w-4" />
        Campaigns
      </Link>

      <Link
        to="/brand/orders"
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive('/brand/orders')
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Package className="mr-3 h-4 w-4" />
        Orders
      </Link>

      <Link
        to="/brand/creators"
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive('/brand/creators')
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Users className="mr-3 h-4 w-4" />
        Creators
      </Link>

      <Link
        to="/brand/settings"
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive('/brand/settings')
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Settings className="mr-3 h-4 w-4" />
        Settings
      </Link>
    </nav>
  );
};

export default BrandSidebarNavigation;
