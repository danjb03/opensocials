
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-light text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your campaigns and track performance</p>
      </div>
      <Button 
        onClick={() => navigate('/brand/create-campaign')}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Campaign
      </Button>
    </div>
  );
};

export default DashboardHeader;
