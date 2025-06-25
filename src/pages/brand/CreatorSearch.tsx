
import React, { useState } from 'react';
import { useCreatorSearchNew } from '@/hooks/useCreatorSearchNew';
import BrandLayout from '@/components/layouts/BrandLayout';
import CreatorSearchHeader from '@/components/brand/creator-search/CreatorSearchHeader';
import CreatorSearchFilters from '@/components/brand/creator-search/CreatorSearchFilters';
import CreatorSearchResults from '@/components/brand/creator-search/CreatorSearchResults';
import CreatorSearchModals from '@/components/brand/creator-search/CreatorSearchModals';
import { CreatorSearchFilters as FilterType } from '@/hooks/brand/useCreatorFilters';

const CreatorSearch = () => {
  // Search and filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterType>({
    platforms: [],
    industries: [],
    followerRange: { min: 0, max: 10000000 },
    engagementRange: { min: 0, max: 20 },
    location: '',
    contentTypes: [],
    verified: false
  });
  
  // View and UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  
  // Modal state
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // Data fetching
  const { data: creators = [], isLoading } = useCreatorSearchNew();

  // Remove the incorrect function call
  const setSelectedCampaignId = () => {};

  const handleCreatorSelect = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleViewCreator = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
  };

  const handleInviteCreators = () => {
    if (selectedCreators.length > 0) {
      setShowCampaignModal(true);
    }
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 space-y-6">
        <CreatorSearchHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCount={selectedCreators.length}
          onInviteCreators={handleInviteCreators}
          onShowFavorites={() => setShowFavoritesModal(true)}
        />
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <CreatorSearchFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
          
          <div className="flex-1">
            <CreatorSearchResults
              creators={creators}
              isLoading={isLoading}
              searchQuery={searchQuery}
              filters={filters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedCreators={selectedCreators}
              onCreatorSelect={handleCreatorSelect}
              onViewCreator={handleViewCreator}
            />
          </div>
        </div>
        
        <CreatorSearchModals
          selectedCreatorId={selectedCreatorId}
          onCloseCreatorModal={() => setSelectedCreatorId(null)}
          showFavoritesModal={showFavoritesModal}
          onCloseFavoritesModal={() => setShowFavoritesModal(false)}
          showCampaignModal={showCampaignModal}
          onCloseCampaignModal={() => setShowCampaignModal(false)}
          selectedCreators={selectedCreators}
        />
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
