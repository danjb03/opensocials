
import React from 'react';

interface AgencySidebarQuickActionsProps {
  isSidebarOpen: boolean;
}

const AgencySidebarQuickActions = ({ isSidebarOpen }: AgencySidebarQuickActionsProps) => {
  if (!isSidebarOpen) return null;

  return (
    <div className="p-4 border-b border-border">
      <div className="space-y-2">
        {/* Quick actions section - currently empty */}
      </div>
    </div>
  );
};

export default AgencySidebarQuickActions;
