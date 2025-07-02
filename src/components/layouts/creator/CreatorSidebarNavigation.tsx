
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Briefcase, 
  Camera, 
  User,
  Mail
} from 'lucide-react';

interface CreatorSidebarNavigationProps {
  isSidebarOpen: boolean;
}

const CreatorSidebarNavigation = ({ isSidebarOpen }: CreatorSidebarNavigationProps) => {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/creator/dashboard' },
    { icon: Mail, label: 'Invitations', path: '/creator/invitations' },
    { icon: Briefcase, label: 'Deals', path: '/creator/deals' },
    { icon: Camera, label: 'Campaigns', path: '/creator/campaigns' },
    { icon: BarChart3, label: 'Analytics', path: '/creator/analytics' },
    { icon: User, label: 'Profile', path: '/creator/profile' },
  ];

  return (
    <nav className="flex-1 px-4 py-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          {isSidebarOpen && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default CreatorSidebarNavigation;
