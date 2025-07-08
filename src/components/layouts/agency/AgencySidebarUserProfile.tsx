import React from 'react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface AgencySidebarUserProfileProps {
  isSidebarOpen: boolean;
}

const AgencySidebarUserProfile = ({ isSidebarOpen }: AgencySidebarUserProfileProps) => {
  const { user } = useUnifiedAuth();

  if (!isSidebarOpen) return null;

  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium text-muted-foreground">
            {user?.email?.charAt(0) || 'A'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            Agency Account
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgencySidebarUserProfile;
