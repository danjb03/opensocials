
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
      handleInviteCreator(creatorId.toString(), creator.name, campaignId || undefined);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="p-6">
            <CreatorProfileLoading />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!creator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Creator Profile - {creator.name}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <div className="p-6 pb-0">
            <CreatorHeader creator={creator} />
          </div>
          
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Metrics */}
              <div className="lg:col-span-1">
                <CreatorMetrics creator={creator} />
              </div>
              
              {/* Right Column - About, Skills, Location */}
              <div className="lg:col-span-2 space-y-6">
                <CreatorAbout creator={creator} />
                <CreatorSkills skills={creator.skills} />
                <CreatorAudienceLocation audienceLocation={creator.audienceLocation} />
              </div>
            </div>
            
            <CreatorActionButtons 
              creator={creator} 
              onInvite={handleInvite}
              isLoading={inviteLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
