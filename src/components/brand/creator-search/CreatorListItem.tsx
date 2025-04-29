
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

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
    <Card key={creator.id} className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex items-center flex-1">
            <div className="relative">
              <img 
                src={creator.imageUrl} 
                alt={creator.name} 
                className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-border"
              />
            </div>
            <div>
              <h3 className="font-bold">{creator.name}</h3>
              <p className="text-sm text-gray-600">{creator.platform} · {creator.followers} followers</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {creator.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="bg-secondary text-xs px-2 py-0.5 rounded-full">
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
              <p className="font-medium">{creator.engagement} engagement</p>
              <p className="text-sm text-gray-600">{creator.priceRange}</p>
            </div>
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
            >
              {isSelected ? "Selected" : "Work with"}
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
              {isSelected ? "Selected" : "Work with"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
