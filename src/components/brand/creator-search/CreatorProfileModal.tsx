
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreatorHeader } from './creator-profile-modal/CreatorHeader';
import { CreatorMetrics } from './creator-profile-modal/CreatorMetrics';
import { CreatorAbout } from './creator-profile-modal/CreatorAbout';
import { CreatorSkills } from './creator-profile-modal/CreatorSkills';
import { CreatorSocialLinks } from './creator-profile-modal/CreatorSocialLinks';
import { CreatorAudienceLocation } from './creator-profile-modal/CreatorAudienceLocation';
import { CreatorActionButtons } from './creator-profile-modal/CreatorActionButtons';
import { CreatorCampaignsTab } from './creator-profile-modal/CreatorCampaignsTab';
import { CreatorProfileLoading } from './creator-profile-modal/CreatorProfileLoading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Creator } from '@/types/creator';

interface CreatorProfileModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite: (creatorId: number) => void;
  inviteLoading: boolean;
  isLoading?: boolean;
}

export const CreatorProfileModal = ({
  creator,
  isOpen,
  onClose,
  onInvite,
  inviteLoading,
  isLoading = false
}: CreatorProfileModalProps) => {
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreatorProfileLoading />
        </DialogContent>
      </Dialog>
    );
  }

  if (!creator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Creator Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <CreatorHeader creator={creator} />
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Past Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <CreatorMetrics 
                    followers={creator.followers}
                    avgViews={creator.avgViews}
                    engagementRate={creator.engagementRate}
                  />
                  <CreatorAbout 
                    bio={creator.bio}
                    niche={creator.niche}
                    location={creator.location}
                  />
                  <CreatorSkills skills={creator.skills} />
                </div>
                
                <div className="space-y-6">
                  <CreatorSocialLinks socialLinks={creator.socialLinks} />
                  <CreatorAudienceLocation audienceLocation={creator.audienceLocation} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns" className="mt-6">
              <CreatorCampaignsTab creator={creator} />
            </TabsContent>
          </Tabs>
          
          <CreatorActionButtons 
            creator={creator} 
            onInvite={onInvite}
            isLoading={inviteLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
