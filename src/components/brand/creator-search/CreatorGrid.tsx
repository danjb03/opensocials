
import React from 'react';
import { CreatorCard } from './CreatorCard';
import { Creator } from '@/types/creator';

type CreatorGridProps = {
  creators: Creator[];
  selectedCreators: string[];
  onToggleCreator: (creatorId: string) => void;
  onViewProfile: (creatorId: string) => void;
};

export const CreatorGrid = ({ creators, selectedCreators, onToggleCreator, onViewProfile }: CreatorGridProps) => {
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground">No creators found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {creators.map(creator => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          isSelected={selectedCreators.includes(creator.id)}
          onToggle={() => onToggleCreator(creator.id)}
          onViewProfile={() => onViewProfile(creator.id)}
        />
      ))}
    </div>
  );
};
