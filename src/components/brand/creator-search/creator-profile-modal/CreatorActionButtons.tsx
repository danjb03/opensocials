
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, UserPlus } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorActionButtonsProps {
  creator: Creator;
  onInvite: (creatorId: number) => void;
  isLoading?: Record<string, boolean>;
}

export const CreatorActionButtons = ({ 
  creator, 
  onInvite, 
  isLoading 
}: CreatorActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-3">
      <Button variant="outline" size="sm" className="gap-1 text-[10px] h-7 px-2">
        <BookmarkPlus className="h-3 w-3" />
        Save
      </Button>
      
      <Button 
        className="gap-1 text-[10px] h-7 px-2" 
        size="sm" 
        onClick={() => onInvite(creator.id)} 
        disabled={isLoading?.[`invite-${creator.id}`]}
      >
        {isLoading?.[`invite-${creator.id}`] ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Inviting...
          </span>
        ) : (
          <>
            <UserPlus className="h-3 w-3" />
            Invite to Campaign
          </>
        )}
      </Button>
    </div>
  );
};
