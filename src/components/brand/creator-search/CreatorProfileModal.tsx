
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
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 bg-white">
          <div className="p-8">
            <CreatorProfileLoading />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!creator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Creator Profile - {creator.name}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Enhanced Header with Banner */}
          <div className="relative">
            {/* Banner Background */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              {creator.bannerImageUrl && (
                <img 
                  src={creator.bannerImageUrl} 
                  alt="Creator banner" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Profile Header */}
            <div className="px-8 pb-0">
              <CreatorHeader creator={creator} />
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
              {/* Left Column - Metrics & Location */}
              <div className="lg:col-span-1 space-y-6">
                <CreatorMetrics creator={creator} />
                <CreatorAudienceLocation audienceLocation={creator.audienceLocation} />
              </div>
              
              {/* Right Column - About & Skills */}
              <div className="lg:col-span-2 space-y-6">
                <CreatorAbout creator={creator} />
                <CreatorSkills skills={creator.skills} />
              </div>
            </div>
            
            {/* Action Buttons */}
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
