
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Creator } from '@/types/creator';
import { CreatorHeader } from './creator-profile-modal/CreatorHeader';
import { CreatorMetrics } from './creator-profile-modal/CreatorMetrics';
import { CreatorAbout } from './creator-profile-modal/CreatorAbout';
import { CreatorSkills } from './creator-profile-modal/CreatorSkills';
import { CreatorSocialLinks } from './creator-profile-modal/CreatorSocialLinks';
import { CreatorAudienceLocation } from './creator-profile-modal/CreatorAudienceLocation';
import { CreatorActionButtons } from './creator-profile-modal/CreatorActionButtons';
import { CreatorProfileLoading } from './creator-profile-modal/CreatorProfileLoading';
import { useCreatorInvitationActions } from '@/hooks/useCreatorInvitationActions';
import { useSearchParams } from 'react-router-dom';

interface CreatorProfileModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export const CreatorProfileModal = ({ 
  creator, 
  isOpen, 
  onClose, 
  isLoading 
}: CreatorProfileModalProps) => {
  const { handleInviteCreator, isLoading: inviteLoading } = useCreatorInvitationActions();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');

  const handleInvite = (creatorId: number) => {
    if (creator) {
      // Convert number to string and include campaign ID if available
      handleInviteCreator(creatorId.toString(), creator.name, campaignId || undefined);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <CreatorProfileLoading />
        </DialogContent>
      </Dialog>
    );
  }

  if (!creator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Creator Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <CreatorHeader creator={creator} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CreatorMetrics creator={creator} />
              <CreatorAbout creator={creator} />
              <CreatorSkills skills={creator.skills} />
            </div>
            
            <div className="space-y-6">
              <CreatorSocialLinks socialLinks={creator.socialLinks} />
              <CreatorAudienceLocation audienceLocation={creator.audienceLocation} />
            </div>
          </div>
          
          <CreatorActionButtons 
            creator={creator} 
            onInvite={handleInvite}
            isLoading={inviteLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
