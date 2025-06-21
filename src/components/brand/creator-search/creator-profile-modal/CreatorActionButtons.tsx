
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Creator } from '@/types/creator';
import { CampaignSelectionModal } from './CampaignSelectionModal';
import { useInviteCreatorToProject } from '@/hooks/mutations/useInviteCreatorToProject';

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
        agreedAmount: undefined, // Will be set later in negotiation
        notes: `Invited from creator search to ${campaignName}`
      });
      setShowCampaignModal(false);
    } catch (error) {
      console.error('Failed to invite creator:', error);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
        <Button 
          onClick={handleInviteClick}
          disabled={isLoading || inviteCreatorMutation.isPending}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          {inviteCreatorMutation.isPending ? 'Sending...' : 'Invite Creator'}
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
