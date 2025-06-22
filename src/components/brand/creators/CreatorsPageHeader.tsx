
import React from 'react';

interface CreatorsPageHeaderProps {
  selectedCount: number;
  favoriteCount: number;
  onShowFavorites: () => void;
}

export const CreatorsPageHeader = ({ 
  selectedCount, 
  favoriteCount, 
  onShowFavorites 
}: CreatorsPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">Creator Search</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {selectedCount} selected • {favoriteCount} favorites
        </span>
        {favoriteCount > 0 && (
          <button
            onClick={onShowFavorites}
            className="text-sm text-primary hover:underline"
          >
            View Favorites
          </button>
        )}
      </div>
    </div>
  );
};
