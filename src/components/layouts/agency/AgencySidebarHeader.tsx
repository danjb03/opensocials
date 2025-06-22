
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import SidebarLogo from '@/components/ui/sidebar-logo';

interface AgencySidebarHeaderProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const AgencySidebarHeader = ({ isSidebarOpen, onToggle }: AgencySidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between">
        {isSidebarOpen && (
          <div className="flex items-center space-x-3">
            <SidebarLogo />
            <div>
              <h2 className="font-semibold text-foreground text-lg">OS Platform</h2>
              <p className="text-sm text-muted-foreground">Agency Dashboard</p>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggle}
          className="p-2 h-8 w-8"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AgencySidebarHeader;
