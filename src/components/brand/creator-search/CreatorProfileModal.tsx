
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Creator } from '@/types/creator';
import { useCreatorInvitations } from '@/hooks/useCreatorInvitations';
import { useToast } from '@/hooks/use-toast';
import { CreatorHeader } from './creator-profile-modal/CreatorHeader';
import { CreatorAbout } from './creator-profile-modal/CreatorAbout';
import { CreatorAudienceLocation } from './creator-profile-modal/CreatorAudienceLocation';
import { CreatorSkills } from './creator-profile-modal/CreatorSkills';
import { CreatorMetrics } from './creator-profile-modal/CreatorMetrics';
import { CreatorCampaignsTab } from './creator-profile-modal/CreatorCampaignsTab';
import { CreatorActionButtons } from './creator-profile-modal/CreatorActionButtons';
import { CreatorProfileLoading } from './creator-profile-modal/CreatorProfileLoading';

type CreatorProfileModalProps = {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
};

export const CreatorProfileModal = ({
  creator,
  isOpen,
  onClose,
  isLoading = false
}: CreatorProfileModalProps) => {
  const { handleInviteCreator, isLoading: inviteLoading } = useCreatorInvitations();
  const { toast } = useToast();
  
  if (!creator && !isLoading) return null;
  
  const inviteCreator = () => {
    if (!creator) return;
    
    handleInviteCreator(creator.id.toString(), creator.name);
    toast({
      title: "Creator invited",
      description: `${creator.name} has been invited to collaborate.`,
    });
  };
  
  const renderContent = () => {
    if (isLoading) return <CreatorProfileLoading />;
    if (!creator) return null;
    
    return (
      <>
        <CreatorHeader creator={creator} />
        
        <div className="px-3 pb-3">
          <Tabs defaultValue="about" className="mt-3">
            <TabsList className="grid grid-cols-3 mb-3 h-8">
              <TabsTrigger value="about" className="text-[10px]">About</TabsTrigger>
              <TabsTrigger value="metrics" className="text-[10px]">Metrics</TabsTrigger>
              <TabsTrigger value="campaigns" className="text-[10px]">Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-2">
              <CreatorAbout creator={creator} />
              
              <Separator className="my-2" />
              
              <CreatorAudienceLocation audienceLocation={creator.audienceLocation} />
              
              <Separator className="my-2" />
              
              <CreatorSkills skills={creator.skills} />
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-2">
              <CreatorMetrics creator={creator} />
            </TabsContent>
            
            <TabsContent value="campaigns">
              <CreatorCampaignsTab 
                creator={creator}
                onInvite={inviteCreator}
                isLoading={inviteLoading}
              />
            </TabsContent>
          </Tabs>
          
          <CreatorActionButtons 
            creator={creator}
            onInvite={inviteCreator}
            isLoading={inviteLoading}
          />
        </div>
      </>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-h-[80vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
