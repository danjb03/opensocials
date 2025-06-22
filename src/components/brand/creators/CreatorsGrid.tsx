
import React from 'react';

interface Creator {
  id: number;
  name: string;
  platform: string;
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
          <div key={i} className="h-64 bg-card rounded-lg border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <div
          key={creator.id}
          className="p-4 bg-card rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCreatorSelect(creator.id.toString())}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {creator.name?.charAt(0) || 'C'}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{creator.name || 'Creator'}</h3>
              <p className="text-sm text-muted-foreground">{creator.platform}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreatorToggle(creator.id.toString());
              }}
              className={`px-3 py-1 text-xs rounded ${
                selectedCreators.some(c => c.id === creator.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {selectedCreators.some(c => c.id === creator.id) ? 'Selected' : 'Select'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(creator.id.toString());
              }}
              className={`px-3 py-1 text-xs rounded ${
                favoriteCreators.includes(creator.id.toString())
                  ? 'bg-red-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {favoriteCreators.includes(creator.id.toString()) ? 'Favorited' : 'Favorite'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
