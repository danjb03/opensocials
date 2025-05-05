
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Bell, UserPlus } from 'lucide-react';
import { Creator } from '@/types/orders';
import { Button } from '@/components/ui/button';

interface CreatorCardProps {
  creator: Creator;
  onNotifyInterest: (creatorId: string, creatorName: string) => void;
  onInviteCreator?: (creatorId: string, creatorName: string) => void;
  showInviteButton?: boolean;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ 
  creator, 
  onNotifyInterest, 
  onInviteCreator,
  showInviteButton = false
}) => {
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
        return <CheckCircle className="h-4 w-4 mr-1.5" />;
      case 'declined':
        return <XCircle className="h-4 w-4 mr-1.5" />;
      default:
        return <Clock className="h-4 w-4 mr-1.5" />;
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 hover:border-blue-200 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img 
            src={creator.imageUrl} 
            alt={creator.name} 
            className="h-12 w-12 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
          />
          <div>
            <p className="font-semibold text-gray-900">{creator.name}</p>
            <p className="text-sm text-gray-500">{creator.platform}</p>
          </div>
        </div>
        
        {!showInviteButton && (
          <Badge 
            variant="outline" 
            className={`flex items-center px-2.5 py-1 rounded-full ${getStatusColor(creator.status)}`}
          >
            {getStatusIcon(creator.status)}
            <span className="capitalize font-medium">{creator.status}</span>
          </Badge>
        )}
      </div>
      <div className="flex justify-end mt-2 gap-2">
        {showInviteButton && onInviteCreator && (
          <Button 
            size="sm" 
            variant="default" 
            className="flex items-center gap-1 text-xs"
            onClick={() => onInviteCreator(creator.id, creator.name)}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1" />
            Invite
          </Button>
        )}
        
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 text-xs bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300 rounded-lg shadow-sm"
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
