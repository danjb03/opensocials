
import React from 'react';

interface Creator {
  id: number;
  name: string;
  platform: string;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteCreators: string[];
  creators: Creator[];
}

export const FavoritesModal = ({ isOpen, onClose, favoriteCreators, creators }: FavoritesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Favorite Creators</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {favoriteCreators.length === 0 ? (
            <p className="text-muted-foreground">No favorite creators yet.</p>
          ) : (
            <div className="space-y-2">
              {favoriteCreators.map(creatorId => {
                const creator = creators.find(c => c.id.toString() === creatorId);
                return creator ? (
                  <div key={creatorId} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">{creator.name || 'Creator'}</p>
                    <p className="text-sm text-muted-foreground">{creator.platform}</p>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
