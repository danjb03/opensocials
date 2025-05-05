
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Order, orderStageLabels } from '@/types/orders';
import { formatCurrency } from '@/utils/project';

interface CampaignSummaryProps {
  order: Order;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          {order.title}
          <Badge className="ml-2">{orderStageLabels[order.stage]}</Badge>
        </h2>
      </div>
      <p className="text-sm text-gray-500">Campaign ID: {order.id}</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Budget</p>
          <p className="text-lg font-semibold">{formatCurrency(order.budget, order.currency)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Platforms</p>
          <div className="flex flex-wrap gap-1">
            {order.platformsList.map(platform => (
              <Badge key={platform} variant="outline">{platform}</Badge>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Created On</p>
          <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignSummary;
