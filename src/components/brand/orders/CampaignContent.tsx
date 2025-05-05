
import React from 'react';
import { ContentItem as ContentItemType } from '@/types/orders';
import ContentItem from './ContentItem';

interface CampaignContentProps {
  contentItems?: ContentItemType[];
}

const CampaignContent: React.FC<CampaignContentProps> = ({ contentItems }) => {
  if (!contentItems || contentItems.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-3">Content Items</h3>
      <div className="space-y-3">
        {contentItems.map(item => (
          <ContentItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CampaignContent;
