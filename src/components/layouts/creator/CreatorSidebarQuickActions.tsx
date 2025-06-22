
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';

interface CreatorSidebarQuickActionsProps {
  isSidebarOpen: boolean;
}

const CreatorSidebarQuickActions = ({ isSidebarOpen }: CreatorSidebarQuickActionsProps) => {
  const navigate = useNavigate();

  if (!isSidebarOpen) return null;

  return (
    <div className="p-4 border-b border-border">
      <div className="space-y-2">
        <Button 
          onClick={() => navigate('/creator/invitations')}
          className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          <Heart className="h-4 w-4 mr-2" />
          View Invitations
        </Button>
        <Button 
          onClick={() => navigate('/creator/analytics')}
          variant="outline" 
          className="w-full justify-start"
          size="sm"
        >
          <Search className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>
    </div>
  );
};

export default CreatorSidebarQuickActions;
