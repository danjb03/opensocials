
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { RealCreator } from '@/hooks/brand/useRealCreators';

interface CreatorCardProps {
  creator: RealCreator;
  onInvite: (creatorId: string) => void;
  onFavorite: (creatorId: string) => void;
  isFavorited?: boolean;
}

const CreatorCard = ({ creator, onInvite, onFavorite, isFavorited }: CreatorCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback image if the original fails to load
  const fallbackImage = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`;
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border">
      <div className="relative">
        <img
          src={imageError ? fallbackImage : creator.imageUrl}
          alt={creator.name}
          className="w-full h-48 object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        <Button
          variant="outline"
          size="sm"
          className={`absolute top-2 right-2 ${isFavorited ? 'text-red-500 border-red-500' : ''}`}
          onClick={() => onFavorite(creator.id)}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{creator.name}</h3>
            {creator.username && (
              <p className="text-sm text-muted-foreground">@{creator.username}</p>
            )}
          </div>

          {creator.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {creator.platform}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {creator.followers} followers
            </Badge>
            <Badge variant="outline" className="text-xs">
              {creator.engagement} engagement
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {Math.floor(Math.random() * 1000 + 500)}
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {Math.floor(Math.random() * 100 + 50)}
              </span>
              <span className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                {Math.floor(Math.random() * 50 + 10)}
              </span>
            </div>
            <span className="font-medium text-foreground">{creator.priceRange}</span>
          </div>

          {creator.skills && creator.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {creator.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={() => onInvite(creator.id)}
            variant="default"
          >
            Invite Creator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
