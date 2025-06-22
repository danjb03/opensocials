
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AgencySidebarQuickActionsProps {
  isSidebarOpen: boolean;
}

const AgencySidebarQuickActions = ({ isSidebarOpen }: AgencySidebarQuickActionsProps) => {
  const navigate = useNavigate();

  if (!isSidebarOpen) return null;

  return (
    <div className="p-4 border-b border-border">
      <div className="space-y-2">
        <Button 
          onClick={() => navigate('/agency/create-campaign')}
          className="w-full justify-center bg-white text-black hover:bg-gray-100 hover:text-black rounded-full py-3 px-6 text-base font-medium"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Campaign
        </Button>
      </div>
    </div>
  );
};

export default AgencySidebarQuickActions;
