
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

interface BrandSidebarQuickActionsProps {
  isSidebarOpen: boolean;
}

const BrandSidebarQuickActions = ({ isSidebarOpen }: BrandSidebarQuickActionsProps) => {
  const navigate = useNavigate();

  if (!isSidebarOpen) return null;

  return (
    <div className="p-4 border-b border-border">
      <div className="space-y-2">
        <Button 
          onClick={() => navigate('/brand/create-campaign')}
          className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
        <Button 
          onClick={() => navigate('/brand/creators')}
          variant="outline" 
          className="w-full justify-start"
          size="sm"
        >
          <Search className="h-4 w-4 mr-2" />
          Find Creators
        </Button>
      </div>
    </div>
  );
};

export default BrandSidebarQuickActions;
