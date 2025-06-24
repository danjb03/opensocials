
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, TrendingUp } from 'lucide-react';

interface Creator {
  id: number;
  name: string;
  platform: string;
  imageUrl?: string;
  followers?: string;
  engagement?: string;
  audience?: string;
  contentType?: string;
  priceRange?: string;
  skills?: string[];
}

interface CreatorsGridProps {
  creators: Creator[];
  isLoading: boolean;
  selectedCreators: Creator[];
  favoriteCreators: string[];
  onCreatorSelect: (creatorId: string) => void;
  onCreatorToggle: (creatorId: string) => void;
  onFavoriteToggle: (creatorId: string) => void;
}

export const CreatorsGrid = ({
  creators,
  isLoading,
  selectedCreators,
  favoriteCreators,
  onCreatorSelect,
  onCreatorToggle,
  onFavoriteToggle
}: CreatorsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-80 animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-12"></div>
              </div>
              <div className="h-8 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Creators Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search filters to find more creators.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <Card
          key={creator.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onCreatorSelect(creator.id.toString())}
        >
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              {creator.imageUrl ? (
                <img
                  src={creator.imageUrl}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {creator.name?.charAt(0) || 'C'}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 h-8 w-8 p-0 ${
                favoriteCreators.includes(creator.id.toString())
                  ? 'text-red-500 bg-white/90'
                  : 'text-muted-foreground bg-white/90 hover:text-red-500'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(creator.id.toString());
              }}
            >
              <Heart 
                className={`h-4 w-4 ${
                  favoriteCreators.includes(creator.id.toString()) ? 'fill-current' : ''
                }`} 
              />
            </Button>
          </div>
          
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {creator.name || 'Unknown Creator'}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {creator.platform || 'Unknown Platform'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {creator.followers && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{creator.followers}</span>
                </div>
              )}
              {creator.engagement && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{creator.engagement}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {creator.platform && (
                <Badge variant="outline" className="text-xs">
                  {creator.platform}
                </Badge>
              )}
              {creator.audience && (
                <Badge variant="outline" className="text-xs">
                  {creator.audience}
                </Badge>
              )}
              {creator.contentType && (
                <Badge variant="outline" className="text-xs">
                  {creator.contentType}
                </Badge>
              )}
            </div>

            {creator.priceRange && (
              <div className="text-sm font-medium text-foreground">
                {creator.priceRange}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                variant={
                  selectedCreators.some(c => c.id === creator.id) ? 'default' : 'outline'
                }
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreatorToggle(creator.id.toString());
                }}
              >
                {selectedCreators.some(c => c.id === creator.id) ? 'Selected' : 'Select'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreatorSelect(creator.id.toString());
                }}
              >
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
