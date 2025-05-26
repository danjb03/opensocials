
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, UserPlus, MessageCircle, Star } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorActionButtonsProps {
  creator: Creator;
  onInvite: (creatorId: number) => void;
  isLoading?: boolean;
}

export const CreatorActionButtons = ({ 
  creator, 
  onInvite, 
  isLoading 
}: CreatorActionButtonsProps) => {
  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
            <BookmarkPlus className="h-4 w-4" />
            Save Creator
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300">
            <Star className="h-4 w-4" />
            Favorite
          </Button>
        </div>
        
        {/* Primary Action */}
        <Button 
          className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 shadow-md hover:shadow-lg transition-all duration-200" 
          size="sm" 
          onClick={() => onInvite(creator.id)} 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Invite...
            </span>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Invite to Campaign
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
