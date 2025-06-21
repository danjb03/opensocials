
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, ExternalLink } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorActionButtonsProps {
  creator: Creator;
  onInvite: (creatorId: string) => void; // Changed from number to string
  isLoading?: boolean;
}

export const CreatorActionButtons = ({ 
  creator, 
  onInvite, 
  isLoading = false 
}: CreatorActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
      <Button 
        variant="outline" 
        onClick={() => window.open(creator.socialLinks?.instagram || '#', '_blank')}
        className="flex items-center gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        View Profile
      </Button>
      
      <Button 
        onClick={() => onInvite(creator.id)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
      >
        <UserPlus className="h-4 w-4" />
        {isLoading ? 'Inviting...' : 'Invite Creator'}
      </Button>
    </div>
  );
};
