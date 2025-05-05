
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Info, Check, PlusCircle } from 'lucide-react';

type CreatorListItemProps = {
  creator: {
    id: number;
    name: string;
    platform: string;
    audience: string;
    contentType: string;
    followers: string;
    engagement: string;
    priceRange: string;
    skills: string[];
    imageUrl: string;
    matchScore?: number;
    about?: string;
    bannerImageUrl?: string;
    socialLinks?: {
      tiktok?: string;
      instagram?: string;
      youtube?: string;
      twitter?: string;
      facebook?: string;
    };
    metrics?: {
      followerCount: string;
      engagementRate: string;
      avgViews: string;
      avgLikes: string;
      growthTrend?: string;
    };
  };
  isSelected: boolean;
  onToggleSelect: (creatorId: number) => void;
  onViewProfile: (creatorId: number) => void;
};

export const CreatorListItem = ({ creator, isSelected, onToggleSelect, onViewProfile }: CreatorListItemProps) => {
  return (
    <Card key={creator.id} className="hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex items-center flex-1">
            <div className="relative mr-4">
              <Avatar className="h-14 w-14 border border-gray-200">
                <AvatarImage src={creator.imageUrl} alt={creator.name} />
                <AvatarFallback className="bg-gray-100 text-gray-800">{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              {creator.matchScore && (
                <div className="absolute -top-2 -right-2 bg-black/80 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                  {creator.matchScore}%
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-base">{creator.name}</h3>
              <p className="text-sm text-gray-600">{creator.platform} · {creator.followers}</p>
              
              <div className="flex flex-wrap gap-1.5 mt-2">
                {creator.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {creator.skills.length > 3 && (
                  <span className="text-xs px-2 py-0.5 text-muted-foreground">
                    +{creator.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4 mt-3 md:mt-0">
            <div className="text-right mr-4">
              <div className="bg-gray-50 px-3 py-1 rounded-full text-sm inline-block">
                <span className="font-medium text-primary">{creator.engagement}</span> engagement
              </div>
              <p className="text-sm text-gray-600 mt-1">{creator.priceRange}</p>
            </div>
            
            <Button
              variant="ghost" 
              size="sm"
              className="text-primary hover:bg-primary/10"
              onClick={() => onViewProfile(creator.id)}
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
            
            <Button
              variant={isSelected ? "default" : "outline"}
              onClick={() => onToggleSelect(creator.id)}
              className="min-w-[120px]"
            >
              {isSelected ? (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Selected
                </span>
              ) : (
                <span className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </span>
              )}
            </Button>
          </div>
          
          <div className="md:hidden flex justify-between items-center mt-3">
            <Button
              variant="ghost" 
              size="sm"
              className="text-primary"
              onClick={() => onViewProfile(creator.id)}
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
            
            <Button
              variant={isSelected ? "default" : "outline"}
              onClick={() => onToggleSelect(creator.id)}
              size="sm"
            >
              {isSelected ? (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Selected
                </span>
              ) : (
                <span className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
