
import React from 'react';
import { CreatorListItem } from './CreatorListItem';
import { Creator } from '@/types/creator';

type CreatorListProps = {
  creators: Creator[];
  selectedCreators: string[];
  onToggleCreator: (creatorId: string) => void;
  onViewProfile: (creatorId: string) => void;
};

export const CreatorList = ({ creators, selectedCreators, onToggleCreator, onViewProfile }: CreatorListProps) => {
  if (creators.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-xs font-medium text-gray-900">No creators found</h3>
        <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {creators.map(creator => (
        <CreatorListItem
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
