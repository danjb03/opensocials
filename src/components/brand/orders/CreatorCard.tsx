
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Creator } from '@/types/orders';

interface CreatorCardProps {
  creator: Creator;
  onInviteCreator: (creatorId: string, creatorName: string) => void;
  isLoading?: Record<string, boolean>;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ 
  creator,
  onInviteCreator,
  isLoading = {}
}) => {
  return (
    <div className="rounded-lg border border-border hover:border-border p-3 shadow-sm transition-all flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src={creator.imageUrl} 
          alt={creator.name} 
          className="h-10 w-10 rounded-full object-cover mr-3 border border-border shadow-sm"
        />
        <div>
          <p className="font-medium text-foreground">{creator.name}</p>
          <p className="text-xs text-foreground">{creator.platform}</p>
        </div>
      </div>
      
      <Button 
        size="sm" 
        variant="outline"
        className="text-xs"
        onClick={() => onInviteCreator(creator.id, creator.name)}
        disabled={isLoading?.[`invite-${creator.id}`]}
      >
        {isLoading?.[`invite-${creator.id}`] ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Inviting...
          </span>
        ) : (
          <>
            <UserPlus className="h-3 w-3 mr-1.5" />
            Invite
          </>
        )}
      </Button>
    </div>
  );
};

export default CreatorCard;
