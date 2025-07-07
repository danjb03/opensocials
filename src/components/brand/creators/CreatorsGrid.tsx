
import React from 'react';
import { Loader } from 'lucide-react';
import CreatorCard from './CreatorCard';

interface Creator {
  id: number;
  name: string;
  platform: string;
  imageUrl: string;
  followers: string;
  engagement: string;
  audience: string;
  contentType: string;
  priceRange: string;
  skills: string[];
}

interface CreatorsGridProps {
  creators: Creator[];
  isLoading: boolean;
  selectedCreators: any[];
  favoriteCreators: string[];
  onCreatorSelect: (creatorId: string) => void;
  onCreatorToggle: (creatorId: string) => void;
  onFavoriteToggle: (creatorId: string) => void;
}

export const CreatorsGrid: React.FC<CreatorsGridProps> = ({
  creators,
  isLoading,
  selectedCreators,
  favoriteCreators,
  onCreatorSelect,
  onCreatorToggle,
  onFavoriteToggle
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No creators found matching your filters.</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {creators.length} of {creators.length} creators
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={{
              id: creator.id.toString(),
              name: creator.name,
              platform: creator.platform,
              imageUrl: creator.imageUrl,
              followers: creator.followers,
              engagement: creator.engagement,
              audience: creator.audience,
              contentType: creator.contentType,
              priceRange: creator.priceRange,
              skills: creator.skills,
              username: `@${creator.name.toLowerCase().replace(/\s+/g, '')}`
            }}
            onInvite={() => onCreatorSelect(creator.id.toString())}
            onFavorite={() => onFavoriteToggle(creator.id.toString())}
            isFavorited={favoriteCreators.includes(creator.id.toString())}
          />
        ))}
      </div>
    </div>
  );
};
