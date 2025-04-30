
import { useState } from 'react';
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

const CreatorSearch = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
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
    getActiveFilterCount
  } = useCreatorSearch();

  const {
    selectedCreator,
    isProfileModalOpen,
    isLoadingCreator,
    handleViewCreatorProfile,
    handleCloseProfileModal
  } = useCreatorProfileModal();

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Find Creators</h1>
            <p className="text-gray-600">Discover creators that match your brand's needs</p>
          </div>
          
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
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
        
        <SelectedCreatorsBar 
          selectedCreators={selectedCreators}
          onAddToCart={addCreatorsToProject}
        />
        
        {viewMode === 'grid' ? (
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
