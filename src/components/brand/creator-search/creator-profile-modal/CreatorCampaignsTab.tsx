
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Creator } from '@/types/creator';
import { CampaignSelectionModal } from './CampaignSelectionModal';
import { useInviteCreatorToProject } from '@/hooks/mutations/useInviteCreatorToProject';

interface CreatorCampaignsTabProps {
  creator: Creator;
  onInvite: (creatorId: string) => void;
  isLoading?: Record<string, boolean>;
}

export const CreatorCampaignsTab = ({ 
  creator, 
  onInvite, 
  isLoading 
}: CreatorCampaignsTabProps) => {
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const inviteCreatorMutation = useInviteCreatorToProject();

  const handleInviteClick = () => {
    setShowCampaignModal(true);
  };

  const handleCampaignSelect = async (campaignId: string, campaignName: string) => {
    try {
      await inviteCreatorMutation.mutateAsync({
        projectId: campaignId,
        creatorId: creator.id,
        agreedAmount: undefined,
        notes: `Invited from creator profile to ${campaignName}`
      });
      setShowCampaignModal(false);
    } catch (error) {
      console.error('Failed to invite creator:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <p className="text-muted-foreground mb-2 text-xs">No previous campaigns with this creator.</p>
        <Button 
          variant="outline" 
          onClick={handleInviteClick}
          size="sm" 
          className="text-[10px] h-7 px-2"
          disabled={inviteCreatorMutation.isPending}
        >
          {inviteCreatorMutation.isPending ? 'Inviting...' : 'Invite to Campaign'}
        </Button>
      </div>

      <CampaignSelectionModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        onSelectCampaign={handleCampaignSelect}
        creatorName={creator.name}
      />
    </>
  );
};
