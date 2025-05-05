
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BrandLayout from '@/components/layouts/BrandLayout';
import { CreatorFilters } from '@/components/brand/creator-search/CreatorFilters';
import { CreatorList } from '@/components/brand/creator-search/CreatorList';
import { CreatorGrid } from '@/components/brand/creator-search/CreatorGrid';
import { SelectedCreatorsBar } from '@/components/brand/creator-search/SelectedCreatorsBar';
import { ViewToggle } from '@/components/brand/creator-search/ViewToggle';
import { CreatorProfileModal } from '@/components/brand/creator-search/CreatorProfileModal';
import { useCreatorSearch } from '@/hooks/useCreatorSearch';
import { useCreatorProfileModal } from '@/hooks/useCreatorProfileModal';
import { useSearchParams } from 'react-router-dom';

const CreatorSearch = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');
  
  const {
    searchTerm,
    setSearchTerm,
    filterPlatform,
    setFilterPlatform,
    filterAudience,
    setFilterAudience,
    filterContentType,
    setFilterContentType,
    filterLocation,
    setFilterLocation,
    filterSkills,
    setFilterSkills,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    selectedCreators,
    filteredCreators,
    handleToggleCreator,
    addCreatorsToProject,
    resetFilters,
    getActiveFilterCount,
    availableCampaigns,
    selectedCampaignId,
    setSelectedCampaignId
  } = useCreatorSearch();

  const {
    selectedCreator,
    isProfileModalOpen,
    isLoadingCreator,
    handleViewCreatorProfile,
    handleCloseProfileModal
  } = useCreatorProfileModal();
  
  // Set the campaign ID from URL parameter if present
  useEffect(() => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
    }
  }, [campaignId, setSelectedCampaignId]);

  return (
    <BrandLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Creators</h1>
            <p className="text-gray-600">Discover and collaborate with creators that match your brand</p>
          </div>
          
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        
        <Card className="mb-8 border-gray-100 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <CreatorFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterPlatform={filterPlatform}
              onPlatformChange={setFilterPlatform}
              filterAudience={filterAudience}
              onAudienceChange={setFilterAudience}
              filterContentType={filterContentType}
              onContentTypeChange={setFilterContentType}
              filterLocation={filterLocation}
              onLocationChange={setFilterLocation}
              filterSkills={filterSkills}
              onSkillsChange={setFilterSkills}
              isFilterSheetOpen={isFilterSheetOpen}
              setIsFilterSheetOpen={setIsFilterSheetOpen}
              resetFilters={resetFilters}
              getActiveFilterCount={getActiveFilterCount}
            />
          </CardContent>
        </Card>
        
        {selectedCreators.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <SelectedCreatorsBar 
              selectedCreators={selectedCreators}
              availableCampaigns={availableCampaigns}
              selectedCampaignId={selectedCampaignId}
              onSelectCampaign={setSelectedCampaignId}
              onAddToCart={addCreatorsToProject}
            />
          </div>
        )}
        
        <div className="relative min-h-[300px]">
          {filteredCreators.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No creators found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <CreatorGrid 
              creators={filteredCreators}
              selectedCreators={selectedCreators}
              onToggleCreator={handleToggleCreator}
              onViewProfile={handleViewCreatorProfile}
            />
          ) : (
            <CreatorList
              creators={filteredCreators}
              selectedCreators={selectedCreators}
              onToggleCreator={handleToggleCreator}
              onViewProfile={handleViewCreatorProfile}
            />
          )}
        </div>
        
        <CreatorProfileModal 
          creator={selectedCreator} 
          isOpen={isProfileModalOpen} 
          onClose={handleCloseProfileModal}
          isLoading={isLoadingCreator}
        />
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
