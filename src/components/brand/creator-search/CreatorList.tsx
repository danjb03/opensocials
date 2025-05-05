
import React from 'react';
import { CreatorListItem } from './CreatorListItem';
import { Creator } from '@/types/creator';

type CreatorListProps = {
  creators: Creator[];
  selectedCreators: number[];
  onToggleCreator: (creatorId: number) => void;
  onViewProfile: (creatorId: number) => void;
};

export const CreatorList = ({ creators, selectedCreators, onToggleCreator, onViewProfile }: CreatorListProps) => {
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No creators found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {creators.map(creator => (
        <CreatorListItem
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
