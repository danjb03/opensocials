
import React from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

interface CreatorSidebarUserProfileProps {
  isSidebarOpen: boolean;
}

const CreatorSidebarUserProfile = ({ isSidebarOpen }: CreatorSidebarUserProfileProps) => {
  const { user, creatorProfile } = useUnifiedAuth();

  if (!isSidebarOpen) return null;

  return (
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
  );
};

export default CreatorSidebarUserProfile;
