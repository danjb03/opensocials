
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Info, Check, PlusCircle, Star } from 'lucide-react';

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
    <Card 
      key={creator.id} 
      className="hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Creator Image Section - Left Side */}
          <div className="md:w-48 lg:w-56 relative overflow-hidden">
            <div className="aspect-[4/3] md:h-full w-full">
              <img 
                src={creator.imageUrl}
                alt={creator.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {creator.matchScore && (
              <div className="absolute top-3 right-3 bg-black/80 text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center">
                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                <span>{creator.matchScore}% Match</span>
              </div>
            )}
          </div>
          
          {/* Creator Info Section - Right Side */}
          <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Avatar className="h-9 w-9 border border-gray-200 mr-3">
                  <AvatarImage src={creator.imageUrl} alt={creator.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-800">{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{creator.name}</h3>
                  <p className="text-sm text-gray-600">{creator.platform} · {creator.followers}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                {creator.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
                {creator.skills.length > 4 && (
                  <span className="text-xs px-2.5 py-1 text-muted-foreground">
                    +{creator.skills.length - 4}
                  </span>
                )}
              </div>
              
              <div className="md:hidden mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="bg-gray-50 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium text-primary">{creator.engagement}</span> engagement
                    </div>
                    <div className="bg-gray-50 px-3 py-1 rounded-full text-sm">
                      {creator.priceRange}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex md:flex-col md:justify-between md:items-end min-w-[240px] space-y-4">
              <div className="flex flex-col items-end">
                <div className="flex space-x-2">
                  <div className="bg-gray-50 px-3 py-1 rounded-full text-sm">
                    <span className="font-medium text-primary">{creator.engagement}</span> engagement
                  </div>
                  <div className="bg-gray-50 px-3 py-1 rounded-full text-sm">
                    {creator.priceRange}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>
        
        {/* Mobile Actions */}
        <div className="md:hidden flex justify-between items-center p-4 border-t border-gray-100">
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
      </CardContent>
    </Card>
  );
};
