
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface BrandSidebarHeaderProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const BrandSidebarHeader = ({ isSidebarOpen, onToggle }: BrandSidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between">
        {isSidebarOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">OS</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm">OS Platform</h2>
              <p className="text-xs text-muted-foreground">Brand Dashboard</p>
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

export default BrandSidebarHeader;
