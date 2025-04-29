
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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
  };
  isSelected: boolean;
  onToggleSelect: (creatorId: number) => void;
};

export const CreatorCard = ({ creator, isSelected, onToggleSelect }: CreatorCardProps) => {
  return (
    <Card key={creator.id} className="overflow-hidden">
      <div className="relative aspect-square">
        <img 
          src={creator.imageUrl} 
          alt={creator.name} 
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
          {creator.matchScore}% match
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{creator.name}</h3>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-gray-600">Platform: {creator.platform}</p>
          <p className="text-sm text-gray-600">Followers: {creator.followers}</p>
          <p className="text-sm text-gray-600">Engagement: {creator.engagement}</p>
          <p className="text-sm text-gray-600">Price: {creator.priceRange}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {creator.skills.map(skill => (
              <span key={skill} className="bg-secondary text-xs px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <Button
          className="w-full mt-4"
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
