
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersHeader = () => {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/brand/projects/create');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Campaign Management</h1>
        <p className="text-gray-500">Manage and track your campaigns through each stage</p>
      </div>
      <Button onClick={handleCreateCampaign}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create Campaign
      </Button>
    </div>
  );
};

export default OrdersHeader;
