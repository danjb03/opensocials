
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorActionButtonsProps {
  creator: Creator;
  onInvite: () => void;
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
        onClick={onInvite}
        disabled={isLoading}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
      >
        <UserPlus className="h-4 w-4" />
        {isLoading ? 'Inviting...' : 'Invite Creator'}
      </Button>
    </div>
  );
};
