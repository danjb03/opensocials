
import React, { useState } from 'react';
import CreatorSearchHeader from '@/components/brand/creator-search/CreatorSearchHeader';
import CreatorSearchFilters from '@/components/brand/creator-search/CreatorSearchFilters';
import CreatorSearchResults from '@/components/brand/creator-search/CreatorSearchResults';
import CreatorSearchModals from '@/components/brand/creator-search/CreatorSearchModals';
import { useCreatorSearch } from '@/hooks/useCreatorSearch';
import { Creator } from '@/types/creator';

const BrandCreators = () => {
  const {
    creators,
    isLoading,
    searchTerm,
    filters,
    selectedCreators,
    favoriteCreators,
    showProfileModal,
    showFavoritesModal,
    selectedCreatorId,
    viewMode,
    handleSearchChange,
    handleFilterChange,
    handleCreatorSelect,
    handleCreatorToggle,
    handleProfileModalClose,
    handleFavoritesModalToggle,
    handleViewModeChange,
    handleFavoriteToggle,
    handleClearFavorites
  } = useCreatorSearch();

  return (
    <div className="container mx-auto p-6 bg-background">
      <CreatorSearchHeader 
        selectedCount={selectedCreators.length}
        favoriteCount={favoriteCreators.length}
        onShowFavorites={handleFavoritesModalToggle}
      />
      
      <CreatorSearchFilters 
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />
      
      <CreatorSearchResults 
        creators={creators}
        isLoading={isLoading}
        selectedCreators={selectedCreators}
        favoriteCreators={favoriteCreators}
        viewMode={viewMode}
        onCreatorSelect={handleCreatorSelect}
        onCreatorToggle={handleCreatorToggle}
        onViewModeChange={handleViewModeChange}
        onFavoriteToggle={handleFavoriteToggle}
      />
      
      <CreatorSearchModals 
        showProfileModal={showProfileModal}
        showFavoritesModal={showFavoritesModal}
        selectedCreatorId={selectedCreatorId}
        favoriteCreators={favoriteCreators}
        onProfileModalClose={handleProfileModalClose}
        onFavoritesModalClose={handleFavoritesModalToggle}
        onClearFavorites={handleClearFavorites}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
};

export default BrandCreators;
