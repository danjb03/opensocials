
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/orders';

interface CampaignDetailViewProps {
  order: Order;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-5">
        <div className="pb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{order.title}</h2>
          <p className="text-gray-600 mt-2">
            {order.description || 'No description provided'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Budget</p>
            <p className="font-semibold text-lg">${order.budget.toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Platforms</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {order.platformsList && order.platformsList.length > 0 ? (
                order.platformsList.map((platform) => (
                  <Badge 
                    key={platform}
                    className="capitalize text-sm px-3 py-1 font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {platform}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500">No platforms specified</span>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 capitalize">
            {order.stage.replace('_', ' ')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailView;
