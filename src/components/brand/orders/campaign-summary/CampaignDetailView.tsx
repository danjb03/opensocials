import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/orders';

interface CampaignDetailViewProps {
  order: Order;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({ order }) => {
  return (
    <div className="bg-black rounded-lg shadow-sm border border-gray-800 overflow-hidden">
      <div className="p-6 space-y-5">
        <div className="pb-4">
          <h2 className="text-2xl font-semibold text-white">{order.title}</h2>
          <p className="text-white mt-2">
            {order.description || 'No description provided'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-white mb-1">Budget</p>
            <p className="font-semibold text-lg text-white">${order.budget.toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-white mb-1">Platforms</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {order.platformsList && order.platformsList.length > 0 ? (
                order.platformsList.map((platform) => (
                  <Badge 
                    key={platform}
                    className="capitalize text-sm px-3 py-1 font-medium bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
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
          <p className="text-sm text-white mb-1">Status</p>
          <Badge variant="outline" className="px-3 py-1 bg-blue-600 text-white border-blue-600 capitalize">
            {order.stage.replace('_', ' ')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailView;
