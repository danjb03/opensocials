
import React, { useState } from 'react';
import { useCreatorSearch } from '@/hooks/useCreatorSearch';
import { CreatorsPageHeader } from '@/components/brand/creators/CreatorsPageHeader';
import { CreatorsSearchFilters } from '@/components/brand/creators/CreatorsSearchFilters';
import { CreatorsGrid } from '@/components/brand/creators/CreatorsGrid';
import { CreatorProfileModal } from '@/components/brand/creators/CreatorProfileModal';
import { FavoritesModal } from '@/components/brand/creators/FavoritesModal';

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

  // Local state for UI features
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

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedCreatorId(null);
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="space-y-6">
        <CreatorsPageHeader
          selectedCount={selectedCreators.length}
          favoriteCount={favoriteCreators.length}
          onShowFavorites={() => setShowFavoritesModal(true)}
        />

        <CreatorsSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterPlatform={filterPlatform}
          onPlatformChange={setFilterPlatform}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <CreatorsGrid
          creators={creators}
          isLoading={isLoading}
          selectedCreators={selectedCreators}
          favoriteCreators={favoriteCreators}
          onCreatorSelect={handleCreatorSelect}
          onCreatorToggle={handleCreatorToggleLocal}
          onFavoriteToggle={handleFavoriteToggle}
        />

        <CreatorProfileModal
          isOpen={showProfileModal}
          onClose={handleCloseProfileModal}
          creatorId={selectedCreatorId}
        />

        <FavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
          favoriteCreators={favoriteCreators}
          creators={creators}
        />
      </div>
    </div>
  );
};

export default BrandCreators;
