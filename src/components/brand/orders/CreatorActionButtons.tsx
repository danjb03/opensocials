
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, UserPlus, Check } from 'lucide-react';

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
          {isLoading?.[`invite-${creatorId}`] ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inviting...
            </span>
          ) : (
            <>
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Invite
            </>
          )}
        </Button>
      )}
      
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-1 text-xs"
        onClick={() => onNotifyInterest(creatorId, creatorName)}
        disabled={isLoading?.[`notify-${creatorId}`]}
      >
        {isLoading?.[`notify-${creatorId}`] ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Notifying...
          </span>
        ) : (
          <>
            <Bell className="h-3.5 w-3.5 mr-1" />
            Notify Interest
          </>
        )}
      </Button>
    </div>
  );
};

export default CreatorActionButtons;
