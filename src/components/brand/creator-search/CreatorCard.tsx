
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PlusCircle, Info, Check } from 'lucide-react';

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
    <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-gray-100 max-w-[280px]">
      <div className="relative h-36">
        <img 
          src={creator.imageUrl} 
          alt={creator.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {creator.matchScore && (
          <div className="absolute top-2 right-2 bg-black/80 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
            {creator.matchScore}% Match
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 border-2 border-white mr-1.5">
              <AvatarImage src={creator.imageUrl} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-sm text-white">{creator.name}</h3>
              <div className="flex items-center text-xs text-white/90">
                <span className="flex items-center text-[10px]">
                  {creator.platform} · {creator.followers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="bg-gray-50 px-1.5 py-0.5 rounded-full text-xs">
            <span className="font-medium text-primary text-[10px]">{creator.engagement}</span> engagement
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:bg-primary/10 h-6 px-1.5 text-[10px]"
            onClick={() => onViewProfile(creator.id)}
          >
            <Info className="h-3 w-3 mr-1" />
            Profile
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1 mb-2">
          {creator.skills.slice(0, 2).map(skill => (
            <span key={skill} className="bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
              {skill}
            </span>
          ))}
          {creator.skills.length > 2 && (
            <span className="text-[10px] px-1 py-0.5 text-muted-foreground">
              +{creator.skills.length - 2} more
            </span>
          )}
        </div>
        
        <Button
          className="w-full mt-1 relative overflow-hidden group h-7 text-[10px]"
          variant={isSelected ? "default" : "outline"}
          onClick={() => onToggleSelect(creator.id)}
        >
          {isSelected ? (
            <>
              <span className="flex items-center">
                <Check className="mr-1 h-3 w-3" />
                Selected
              </span>
            </>
          ) : (
            <>
              <span className="relative z-10 flex items-center">
                <PlusCircle className="mr-1 h-3 w-3" />
                Add to Project
              </span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
