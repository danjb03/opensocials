
import React, { useState } from 'react';
import { useCreatorSearch } from '@/hooks/useCreatorSearch';
import { Creator } from '@/types/creator';

const BrandCreators = () => {
  const {
    creators,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterPlatform,
    setFilterPlatform,
    selectedCreators,
    handleToggleCreator
  } = useCreatorSearch();

  // Local state for features not provided by the hook
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteCreators, setFavoriteCreators] = useState<string[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  const handleCreatorSelect = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setShowProfileModal(true);
  };

  const handleCreatorToggleLocal = (creatorId: string) => {
    const creator = creators.find(c => c.id.toString() === creatorId);
    if (creator) {
      handleToggleCreator(creator);
    }
  };

  const handleFavoriteToggle = (creatorId: string) => {
    setFavoriteCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Creator Search</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {selectedCreators.length} selected • {favoriteCreators.length} favorites
            </span>
            {favoriteCreators.length > 0 && (
              <button
                onClick={() => setShowFavoritesModal(true)}
                className="text-sm text-primary hover:underline"
              >
                View Favorites
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-64 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </select>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'grid' | 'list')}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-card rounded-lg border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="p-4 bg-card rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCreatorSelect(creator.id.toString())}
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
                      handleCreatorToggleLocal(creator.id.toString());
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
                      handleFavoriteToggle(creator.id.toString());
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
        )}

        {/* Profile Modal */}
        {showProfileModal && selectedCreatorId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Creator Profile</h2>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedCreatorId(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">Creator details would be shown here.</p>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Modal */}
        {showFavoritesModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Favorite Creators</h2>
                <button
                  onClick={() => setShowFavoritesModal(false)}
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
        )}
      </div>
    </div>
  );
};

export default BrandCreators;
