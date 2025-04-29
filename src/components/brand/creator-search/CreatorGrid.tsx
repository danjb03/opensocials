
import React from 'react';
import { CreatorCard } from './CreatorCard';
import { Creator } from '@/types/creator';

type CreatorGridProps = {
  creators: Creator[];
  selectedCreators: number[];
  onToggleCreator: (creatorId: number) => void;
  onViewProfile: (creatorId: number) => void;
};

export const CreatorGrid = ({ creators, selectedCreators, onToggleCreator, onViewProfile }: CreatorGridProps) => {
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No creators found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map(creator => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          isSelected={selectedCreators.includes(creator.id)}
          onToggleSelect={onToggleCreator}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};
