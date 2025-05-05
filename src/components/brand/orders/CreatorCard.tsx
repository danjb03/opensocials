
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Bell } from 'lucide-react';
import { Creator } from '@/types/orders';
import { Button } from '@/components/ui/button';

interface CreatorCardProps {
  creator: Creator;
  onNotifyInterest: (creatorId: string, creatorName: string) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onNotifyInterest }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'invited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'accepted':
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'declined':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img 
            src={creator.imageUrl} 
            alt={creator.name} 
            className="h-10 w-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-medium">{creator.name}</p>
            <p className="text-sm text-gray-500">{creator.platform}</p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={`flex items-center ${getStatusColor(creator.status)}`}
        >
          {getStatusIcon(creator.status)}
          <span className="capitalize">{creator.status}</span>
        </Badge>
      </div>
      <div className="flex justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 text-xs"
          onClick={() => onNotifyInterest(creator.id, creator.name)}
        >
          <Bell className="h-3.5 w-3.5 mr-1" />
          Notify Interest
        </Button>
      </div>
    </div>
  );
};

export default CreatorCard;
