
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, UserPlus } from 'lucide-react';

interface CreatorActionButtonsProps {
  creatorId: string;
  creatorName: string;
  showInviteButton: boolean;
  onNotifyInterest: (creatorId: string, creatorName: string) => void;
  onInviteCreator?: (creatorId: string, creatorName: string) => void;
  isLoading?: Record<string, boolean>;
}

const CreatorActionButtons: React.FC<CreatorActionButtonsProps> = ({
  creatorId,
  creatorName,
  showInviteButton,
  onNotifyInterest,
  onInviteCreator,
  isLoading = {}
}) => {
  return (
    <div className="flex justify-end mt-2 gap-2">
      {showInviteButton && onInviteCreator && (
        <Button 
          size="sm" 
          variant="default" 
          className="flex items-center gap-1 text-xs"
          onClick={() => onInviteCreator(creatorId, creatorName)}
          disabled={isLoading?.[`invite-${creatorId}`]}
        >
          <UserPlus className="h-3.5 w-3.5 mr-1" />
          {isLoading?.[`invite-${creatorId}`] ? 'Inviting...' : 'Invite'}
        </Button>
      )}
      
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-1 text-xs bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300 rounded-lg shadow-sm"
        onClick={() => onNotifyInterest(creatorId, creatorName)}
        disabled={isLoading?.[`notify-${creatorId}`]}
      >
        <Bell className="h-3.5 w-3.5 mr-1" />
        {isLoading?.[`notify-${creatorId}`] ? 'Notifying...' : 'Notify Interest'}
      </Button>
    </div>
  );
};

export default CreatorActionButtons;
