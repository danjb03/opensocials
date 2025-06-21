
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
import { CreatorAnalytics } from './creator-profile-modal/CreatorAnalytics';
import { CreatorInsights } from './creator-profile-modal/CreatorInsights';
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
  console.log('CreatorProfileModal - isOpen:', isOpen, 'creator:', creator, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
          <CreatorProfileLoading />
        </DialogContent>
      </Dialog>
    );
  }

  if (!creator) {
    console.log('CreatorProfileModal - No creator data available');
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle>Creator Profile</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Creator profile could not be loaded.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="sr-only">Creator Profile - {creator.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <CreatorHeader creator={creator} />
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="overview" className="text-foreground">Overview</TabsTrigger>
              <TabsTrigger value="analytics" className="text-foreground">Analytics</TabsTrigger>
              <TabsTrigger value="insights" className="text-foreground">Insights</TabsTrigger>
              <TabsTrigger value="campaigns" className="text-foreground">Past Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <CreatorMetrics creator={creator} />
                  <CreatorAbout creator={creator} />
                  <CreatorSkills skills={creator.skills || []} />
                </div>
                
                <div className="space-y-6">
                  <CreatorSocialLinks socialLinks={creator.socialLinks} />
                  <CreatorAudienceLocation audienceLocation={creator.audienceLocation} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <CreatorAnalytics creator={creator} />
            </TabsContent>
            
            <TabsContent value="insights" className="mt-6">
              <CreatorInsights creator={creator} />
            </TabsContent>
            
            <TabsContent value="campaigns" className="mt-6">
              <CreatorCampaignsTab 
                creator={creator} 
                onInvite={onInvite}
                isLoading={{ [`invite-${creator.id}`]: inviteLoading }}
              />
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
