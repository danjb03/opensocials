
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
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };
  
  const renderSocialLinks = () => {
    if (!creator?.socialLinks) return null;
    return <div className="flex gap-2 mt-3">
        {Object.entries(creator.socialLinks).map(([platform, url]) => {
        if (!url) return null;
        return <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors" aria-label={`Visit ${creator?.name}'s ${platform}`}>
              {getSocialIcon(platform)}
            </a>;
      })}
      </div>;
  };
  
  const renderAudienceLocation = () => {
    if (!creator?.audienceLocation) return null;
    return <div className="space-y-2">
        <h3 className="font-medium text-base flex items-center gap-1.5">
          <Globe className="h-4 w-4" />
          Audience Location
        </h3>
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="mb-2">
            <h4 className="text-xs text-muted-foreground">Primary Location</h4>
            <p className="font-semibold text-sm">{creator.audienceLocation.primary}</p>
          </div>
          
          {creator.audienceLocation.secondary && creator.audienceLocation.secondary.length > 0 && <div className="mb-2">
              <h4 className="text-xs text-muted-foreground">Secondary Locations</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {creator.audienceLocation.secondary.map(location => <Badge key={location} variant="outline" className="text-xs py-0">{location}</Badge>)}
              </div>
            </div>}
          
          {creator.audienceLocation.countries && creator.audienceLocation.countries.length > 0 && <div>
              <h4 className="text-xs text-muted-foreground mb-1">Audience Breakdown</h4>
              {creator.audienceLocation.countries.map(country => <div key={country.name} className="mb-1.5">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span>{country.name}</span>
                    <span className="font-medium">{country.percentage}%</span>
                  </div>
                  <Progress value={country.percentage} className="h-1.5" />
                </div>)}
            </div>}
        </div>
      </div>;
  };
  
  const renderLoadingState = () => <>
      <div className="relative w-full h-24 bg-muted/30">
        <Skeleton className="absolute w-16 h-16 rounded-full -bottom-8 left-4 border-4 border-background" />
      </div>
      <div className="pt-12 px-4 pb-4">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-3 w-1/4 mb-4" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-4" />
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
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
          <div className="h-24 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20">
            {creator.bannerImageUrl && <img src={creator.bannerImageUrl} alt="" className="w-full h-full object-cover opacity-90" />}
          </div>
          
          {/* Avatar */}
          <Avatar className="absolute w-16 h-16 -bottom-8 left-4 border-4 border-background">
            <AvatarImage src={creator.imageUrl} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="pt-12 px-4 pb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{creator.name}</h2>
              <p className="text-muted-foreground text-sm">{creator.platform} Creator</p>
              {renderSocialLinks()}
            </div>
            
            <div className="flex flex-col gap-1.5 items-end">
              <Badge variant="secondary" className="text-xs py-0.5">
                {creator.audience}
              </Badge>
              <Badge variant="outline" className="text-xs py-0.5">
                {creator.contentType}
              </Badge>
              {creator.audienceLocation && <Badge variant="secondary" className="text-xs py-0.5 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {creator.audienceLocation.primary}
                </Badge>}
            </div>
          </div>
          
          <Tabs defaultValue="about" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="about" className="text-xs">About</TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
              <TabsTrigger value="campaigns" className="text-xs">Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium text-base">About Me</h3>
                <p className="text-muted-foreground text-sm">
                  {creator.about || "No information provided."}
                </p>
              </div>
              
              <Separator className="my-3" />
              
              {renderAudienceLocation()}
              
              <Separator className="my-3" />
              
              <div className="space-y-2">
                <h3 className="font-medium text-base">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {creator.skills.map(skill => <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>)}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h3 className="text-xs text-muted-foreground mb-1">Followers</h3>
                  <p className="text-lg font-semibold">{creator.metrics?.followerCount || creator.followers}</p>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h3 className="text-xs text-muted-foreground mb-1">Engagement Rate</h3>
                  <div className="flex items-end gap-2">
                    <p className="text-lg font-semibold">{creator.metrics?.engagementRate || creator.engagement}</p>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-help">What's this?</span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64 text-xs">
                        <p>
                          Engagement rate is calculated as (likes + comments) / followers × 100%.
                          This represents how much your audience interacts with your content.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h3 className="text-xs text-muted-foreground mb-1">Average Views</h3>
                  <p className="text-lg font-semibold">{creator.metrics?.avgViews || "Not available"}</p>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h3 className="text-xs text-muted-foreground mb-1">Average Likes</h3>
                  <p className="text-lg font-semibold">{creator.metrics?.avgLikes || "Not available"}</p>
                </div>
                
                <div className="col-span-1 md:col-span-2 bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs text-muted-foreground">Price Range</h3>
                    <p className="font-semibold text-sm">{creator.priceRange}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground mb-3 text-sm">No previous campaigns with this creator.</p>
                <Button variant="outline" onClick={inviteCreator} size="sm">Invite to Campaign</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-1.5">
              <BookmarkPlus className="h-3.5 w-3.5" />
              Save
            </Button>
            
            <Button className="gap-1.5" size="sm" onClick={inviteCreator} disabled={inviteLoading?.[`invite-${creator.id}`]}>
              {inviteLoading?.[`invite-${creator.id}`] ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inviting...
                </span>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
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
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden max-h-[80vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
