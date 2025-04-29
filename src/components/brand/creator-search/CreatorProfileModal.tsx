import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Creator } from '@/types/creator';
import { Instagram, Youtube, Twitter, Facebook, ExternalLink, BookmarkPlus, MessageSquare, BarChart2, Globe } from 'lucide-react';

type CreatorProfileModalProps = {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
};

export const CreatorProfileModal = ({ creator, isOpen, onClose, isLoading = false }: CreatorProfileModalProps) => {
  if (!creator && !isLoading) return null;

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const renderSocialLinks = () => {
    if (!creator?.socialLinks) return null;
    
    return (
      <div className="flex gap-3 mt-4">
        {Object.entries(creator.socialLinks).map(([platform, url]) => {
          if (!url) return null;
          return (
            <a 
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
              aria-label={`Visit ${creator?.name}'s ${platform}`}
            >
              {getSocialIcon(platform)}
            </a>
          );
        })}
      </div>
    );
  };

  const renderAudienceLocation = () => {
    if (!creator?.audienceLocation) return null;
    
    return (
      <div className="space-y-3">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Audience Location
        </h3>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="mb-3">
            <h4 className="text-sm text-muted-foreground">Primary Location</h4>
            <p className="font-semibold">{creator.audienceLocation.primary}</p>
          </div>
          
          {creator.audienceLocation.secondary && creator.audienceLocation.secondary.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm text-muted-foreground">Secondary Locations</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {creator.audienceLocation.secondary.map(location => (
                  <Badge key={location} variant="outline">{location}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {creator.audienceLocation.countries && creator.audienceLocation.countries.length > 0 && (
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Audience Breakdown</h4>
              {creator.audienceLocation.countries.map(country => (
                <div key={country.name} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{country.name}</span>
                    <span className="font-medium">{country.percentage}%</span>
                  </div>
                  <Progress value={country.percentage} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLoadingState = () => (
    <>
      <div className="relative w-full h-32 bg-muted/30">
        <Skeleton className="absolute w-24 h-24 rounded-full -bottom-12 left-6 border-4 border-background" />
      </div>
      <div className="pt-16 px-6 pb-6">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-20 rounded-md" />
          <Skeleton className="h-20 rounded-md" />
          <Skeleton className="h-20 rounded-md" />
          <Skeleton className="h-20 rounded-md" />
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (!creator) return null;

    return (
      <>
        <div className="relative">
          {/* Banner image */}
          <div className="h-32 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20">
            {creator.bannerImageUrl && (
              <img 
                src={creator.bannerImageUrl} 
                alt="" 
                className="w-full h-full object-cover opacity-90"
              />
            )}
          </div>
          
          {/* Avatar */}
          <Avatar className="absolute w-24 h-24 -bottom-12 left-6 border-4 border-background">
            <AvatarImage src={creator.imageUrl} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="pt-16 px-6 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{creator.name}</h2>
              <p className="text-muted-foreground">{creator.platform} Creator</p>
              {renderSocialLinks()}
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              <Badge variant="secondary" className="text-sm py-1">
                {creator.audience}
              </Badge>
              <Badge variant="outline" className="text-sm py-1">
                {creator.contentType}
              </Badge>
              {creator.audienceLocation && (
                <Badge variant="secondary" className="text-sm py-1 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {creator.audienceLocation.primary}
                </Badge>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="about" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium text-lg">About Me</h3>
                <p className="text-muted-foreground">
                  {creator.about || "No information provided."}
                </p>
              </div>
              
              <Separator className="my-4" />
              
              {renderAudienceLocation()}
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <h3 className="font-medium text-lg">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.skills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-sm text-muted-foreground mb-1">Followers</h3>
                  <p className="text-2xl font-semibold">{creator.metrics?.followerCount || creator.followers}</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-sm text-muted-foreground mb-1">Engagement Rate</h3>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-semibold">{creator.metrics?.engagementRate || creator.engagement}</p>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="text-sm text-muted-foreground cursor-help">What's this?</span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p className="text-sm">
                          Engagement rate is calculated as (likes + comments) / followers × 100%.
                          This represents how much your audience interacts with your content.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-sm text-muted-foreground mb-1">Average Views</h3>
                  <p className="text-2xl font-semibold">{creator.metrics?.avgViews || "Not available"}</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-sm text-muted-foreground mb-1">Average Likes</h3>
                  <p className="text-2xl font-semibold">{creator.metrics?.avgLikes || "Not available"}</p>
                </div>
                
                <div className="col-span-1 md:col-span-2 bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm text-muted-foreground">Price Range</h3>
                    <p className="font-semibold">{creator.priceRange}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-4">No previous campaigns with this creator.</p>
                <Button variant="outline">Invite to Campaign</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" className="gap-2">
              <BookmarkPlus className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            <Button className="gap-2">
              <BarChart2 className="h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
