
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersHeader = () => {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    // Navigate to projects page with a query parameter to trigger dialog
    navigate('/brand/projects?action=create');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Campaign Management</h1>
        <p className="text-foreground/80">End-to-end campaign control. Track progress and keep every deal on course.</p>
      </div>
      <Button onClick={handleCreateCampaign} className="text-primary-foreground">
        <PlusCircle className="h-4 w-4 mr-2" />
        Create Campaign
      </Button>
    </div>
  );
};

export default OrdersHeader;
