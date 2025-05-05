
import React from 'react';
import { Order, ContentItem as ContentItemType } from '@/types/orders';
import ContentItem from './ContentItem';

interface CampaignContentProps {
  order: Order;
}

const CampaignContent: React.FC<CampaignContentProps> = ({ order }) => {
  const contentItems = order.contentItems || [];

  if (contentItems.length === 0) {
    return (
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Content Items</h3>
        <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-md">
          No content items have been created yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-3">Content Items ({contentItems.length})</h3>
      <div className="space-y-3">
        {contentItems.map(item => (
          <ContentItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CampaignContent;
