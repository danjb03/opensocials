
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PlusCircle, Info, Check, Briefcase } from 'lucide-react';

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
    industries?: string[];
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
    <Card key={creator.id} className="overflow-hidden hover:shadow-sm transition-all duration-300 group border-gray-100">
      <div className="relative h-32">
        <img 
          src={creator.imageUrl} 
          alt={creator.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {creator.matchScore && (
          <div className="absolute top-1 right-1 bg-black/80 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold">
            {creator.matchScore}%
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 border-[1px] border-white mr-1.5">
              <AvatarImage src={creator.imageUrl} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-xs text-white">{creator.name}</h3>
              <div className="flex items-center text-white/90">
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
          <div className="bg-gray-50 px-1.5 py-0.5 rounded-full">
            <span className="font-medium text-primary text-xs">{creator.engagement}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:bg-primary/10 h-6 px-2 text-xs"
            onClick={() => onViewProfile(creator.id)}
          >
            <Info className="h-3 w-3 mr-1" />
            Profile
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1 mb-2">
          {creator.industries && creator.industries.length > 0 && (
            <span className="flex items-center bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full mr-1">
              <Briefcase className="h-2 w-2 mr-0.5" />
              {creator.industries[0]}
            </span>
          )}
          
          {creator.skills.slice(0, creator.industries && creator.industries.length > 0 ? 1 : 2).map(skill => (
            <span key={skill} className="bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          
          {(creator.skills.length > (creator.industries && creator.industries.length > 0 ? 1 : 2) || 
           (creator.industries && creator.industries.length > 1)) && (
            <span className="text-[10px] px-1 py-0.5 text-muted-foreground">
              +{(creator.skills.length - (creator.industries && creator.industries.length > 0 ? 1 : 2)) + 
                 (creator.industries ? creator.industries.length - 1 : 0)}
            </span>
          )}
        </div>
        
        <Button
          className="w-full mt-1 relative overflow-hidden group h-7 text-xs"
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
                Add
              </span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
