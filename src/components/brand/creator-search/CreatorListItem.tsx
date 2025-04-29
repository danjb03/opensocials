
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  };
  isSelected: boolean;
  onToggleSelect: (creatorId: number) => void;
};

export const CreatorListItem = ({ creator, isSelected, onToggleSelect }: CreatorListItemProps) => {
  return (
    <Card key={creator.id}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex items-center flex-1">
            <div className="relative">
              <img 
                src={creator.imageUrl} 
                alt={creator.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div className="absolute -top-1 -right-1 bg-background/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-xs font-medium border">
                {creator.matchScore}%
              </div>
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
              </div>
            </div>
          </div>
          <div className="hidden md:block text-right mr-4">
            <p className="font-medium">{creator.engagement} engagement</p>
            <p className="text-sm text-gray-600">{creator.priceRange}</p>
          </div>
          <Button
            variant={isSelected ? "default" : "outline"}
            onClick={() => onToggleSelect(creator.id)}
            className="mt-3 md:mt-0"
          >
            {isSelected ? "Selected" : "Work with"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
