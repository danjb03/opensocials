
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ContentItem as ContentItemType } from '@/types/orders';

interface ContentItemProps {
  item: ContentItemType;
}

const ContentItem: React.FC<ContentItemProps> = ({ item }) => {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex items-center">
        <div>
          <p className="font-medium">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
          <p className="text-sm text-gray-500">By {item.creatorName} • {item.platform}</p>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`capitalize ${getStatusClass(item.status)}`}
      >
        {item.status}
      </Badge>
    </div>
  );
};

export default ContentItem;
