
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorCampaignsTabProps {
  creator: Creator;
  onInvite: (creatorId: number) => void;
  isLoading?: Record<string, boolean>;
}

export const CreatorCampaignsTab = ({ 
  creator, 
  onInvite, 
  isLoading 
}: CreatorCampaignsTabProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <p className="text-muted-foreground mb-2 text-xs">No previous campaigns with this creator.</p>
      <Button 
        variant="outline" 
        onClick={() => onInvite(creator.id)} 
        size="sm" 
        className="text-[10px] h-7 px-2"
      >
        Invite to Campaign
      </Button>
    </div>
  );
};
