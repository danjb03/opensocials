
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Creator } from '@/types/creator';
import { Instagram, Youtube, Twitter, Facebook, ExternalLink, BookmarkPlus, MessageSquare, BarChart2, Globe, UserPlus } from 'lucide-react';
import { useCreatorInvitations } from '@/hooks/useCreatorInvitations';
import { useToast } from '@/hooks/use-toast';

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
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-3 w-3" />;
      case 'youtube':
        return <Youtube className="h-3 w-3" />;
      case 'twitter':
        return <Twitter className="h-3 w-3" />;
      case 'facebook':
        return <Facebook className="h-3 w-3" />;
      default:
        return <ExternalLink className="h-3 w-3" />;
    }
  };
  
  const renderSocialLinks = () => {
    if (!creator?.socialLinks) return null;
    return <div className="flex gap-1.5 mt-2">
        {Object.entries(creator.socialLinks).map(([platform, url]) => {
        if (!url) return null;
        return <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="p-1 bg-secondary rounded-full hover:bg-secondary/80 transition-colors" aria-label={`Visit ${creator?.name}'s ${platform}`}>
              {getSocialIcon(platform)}
            </a>;
      })}
      </div>;
  };
  
  const renderAudienceLocation = () => {
    if (!creator?.audienceLocation) return null;
    return <div className="space-y-1.5">
        <h3 className="font-medium text-sm flex items-center gap-1">
          <Globe className="h-3 w-3" />
          Audience Location
        </h3>
        <div className="bg-muted/30 p-2 rounded-lg text-xs">
          <div className="mb-1.5">
            <h4 className="text-[10px] text-muted-foreground">Primary Location</h4>
            <p className="font-semibold">{creator.audienceLocation.primary}</p>
          </div>
          
          {creator.audienceLocation.secondary && creator.audienceLocation.secondary.length > 0 && <div className="mb-1.5">
              <h4 className="text-[10px] text-muted-foreground">Secondary Locations</h4>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {creator.audienceLocation.secondary.map(location => <Badge key={location} variant="outline" className="text-[10px] py-0">{location}</Badge>)}
              </div>
            </div>}
          
          {creator.audienceLocation.countries && creator.audienceLocation.countries.length > 0 && <div>
              <h4 className="text-[10px] text-muted-foreground mb-0.5">Audience Breakdown</h4>
              {creator.audienceLocation.countries.map(country => <div key={country.name} className="mb-1">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span>{country.name}</span>
                    <span className="font-medium">{country.percentage}%</span>
                  </div>
                  <Progress value={country.percentage} className="h-1" />
                </div>)}
            </div>}
        </div>
      </div>;
  };
  
  const renderLoadingState = () => <>
      <div className="relative w-full h-16 bg-muted/30">
        <Skeleton className="absolute w-12 h-12 rounded-full -bottom-6 left-4 border-4 border-background" />
      </div>
      <div className="pt-8 px-4 pb-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-3 w-1/4 mb-4" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-4" />
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </>;
  
  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (!creator) return null;
    
    return (
      <>
        <div className="relative">
          {/* Banner image */}
          <div className="h-16 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20">
            {creator.bannerImageUrl && <img src={creator.bannerImageUrl} alt="" className="w-full h-full object-cover opacity-90" />}
          </div>
          
          {/* Avatar */}
          <Avatar className="absolute w-12 h-12 -bottom-6 left-4 border-3 border-background">
            <AvatarImage src={creator.imageUrl} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="pt-8 px-3 pb-3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-base font-bold">{creator.name}</h2>
              <p className="text-muted-foreground text-xs">{creator.platform} Creator</p>
              {renderSocialLinks()}
            </div>
            
            <div className="flex flex-col gap-1 items-end">
              <Badge variant="secondary" className="text-[10px] py-0.5">
                {creator.audience}
              </Badge>
              <Badge variant="outline" className="text-[10px] py-0.5">
                {creator.contentType}
              </Badge>
              {creator.audienceLocation && <Badge variant="secondary" className="text-[10px] py-0.5 flex items-center gap-1">
                  <Globe className="h-2 w-2" />
                  {creator.audienceLocation.primary}
                </Badge>}
            </div>
          </div>
          
          <Tabs defaultValue="about" className="mt-3">
            <TabsList className="grid grid-cols-3 mb-3 h-8">
              <TabsTrigger value="about" className="text-[10px]">About</TabsTrigger>
              <TabsTrigger value="metrics" className="text-[10px]">Metrics</TabsTrigger>
              <TabsTrigger value="campaigns" className="text-[10px]">Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-2">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">About Me</h3>
                <p className="text-muted-foreground text-xs">
                  {creator.about || "No information provided."}
                </p>
              </div>
              
              <Separator className="my-2" />
              
              {renderAudienceLocation()}
              
              <Separator className="my-2" />
              
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {creator.skills.map(skill => <Badge key={skill} variant="secondary" className="text-[10px]">
                      {skill}
                    </Badge>)}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 p-2 rounded-lg">
                  <h3 className="text-[10px] text-muted-foreground mb-0.5">Followers</h3>
                  <p className="text-sm font-semibold">{creator.metrics?.followerCount || creator.followers}</p>
                </div>
                
                <div className="bg-muted/30 p-2 rounded-lg">
                  <h3 className="text-[10px] text-muted-foreground mb-0.5">Engagement Rate</h3>
                  <div className="flex items-end gap-1">
                    <p className="text-sm font-semibold">{creator.metrics?.engagementRate || creator.engagement}</p>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="text-[10px] text-muted-foreground cursor-help">What's this?</span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-48 text-[10px] p-2">
                        <p>
                          Engagement rate is calculated as (likes + comments) / followers × 100%.
                          This represents how much your audience interacts with your content.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-2 rounded-lg">
                  <h3 className="text-[10px] text-muted-foreground mb-0.5">Average Views</h3>
                  <p className="text-sm font-semibold">{creator.metrics?.avgViews || "Not available"}</p>
                </div>
                
                <div className="bg-muted/30 p-2 rounded-lg">
                  <h3 className="text-[10px] text-muted-foreground mb-0.5">Average Likes</h3>
                  <p className="text-sm font-semibold">{creator.metrics?.avgLikes || "Not available"}</p>
                </div>
                
                <div className="col-span-2 bg-muted/30 p-2 rounded-lg">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="text-[10px] text-muted-foreground">Price Range</h3>
                    <p className="font-semibold text-xs">{creator.priceRange}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <p className="text-muted-foreground mb-2 text-xs">No previous campaigns with this creator.</p>
                <Button variant="outline" onClick={inviteCreator} size="sm" className="text-[10px] h-7 px-2">Invite to Campaign</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="outline" size="sm" className="gap-1 text-[10px] h-7 px-2">
              <BookmarkPlus className="h-3 w-3" />
              Save
            </Button>
            
            <Button className="gap-1 text-[10px] h-7 px-2" size="sm" onClick={inviteCreator} disabled={inviteLoading?.[`invite-${creator.id}`]}>
              {inviteLoading?.[`invite-${creator.id}`] ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inviting...
                </span>
              ) : (
                <>
                  <UserPlus className="h-3 w-3" />
                  Invite to Campaign
                </>
              )}
            </Button>
          </div>
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
