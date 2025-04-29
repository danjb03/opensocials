
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Info } from 'lucide-react';

type CreatorCardProps = {
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

export const CreatorCard = ({ creator, isSelected, onToggleSelect, onViewProfile }: CreatorCardProps) => {
  return (
    <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square">
        <img 
          src={creator.imageUrl} 
          alt={creator.name} 
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="font-bold text-lg text-white">{creator.name}</h3>
          <p className="text-sm text-white/90">{creator.platform} · {creator.followers}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium">{creator.engagement} engagement</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => onViewProfile(creator.id)}
          >
            <Info className="h-4 w-4 mr-1" />
            More Info
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2 mb-4">
          {creator.skills.slice(0, 3).map(skill => (
            <span key={skill} className="bg-secondary text-xs px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          {creator.skills.length > 3 && (
            <span className="text-xs px-2 py-0.5 text-muted-foreground">
              +{creator.skills.length - 3} more
            </span>
          )}
        </div>
        <Button
          className="w-full mt-2"
          variant={isSelected ? "default" : "outline"}
          onClick={() => onToggleSelect(creator.id)}
        >
          {isSelected ? (
            "Selected"
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Project
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
