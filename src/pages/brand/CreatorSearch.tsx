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
import { Creator } from '@/types/creator';
import { toast } from '@/components/ui/sonner';

const CreatorSearch = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');
  const [inviteLoading, setInviteLoading] = useState(false);
  
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
    filterIndustries,
    setFilterIndustries,
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

  const handleInviteCreator = async (creatorId: number) => {
    setInviteLoading(true);
    try {
      // Add your invite logic here
      toast.success('Creator invited successfully!');
    } catch (error) {
      toast.error('Failed to invite creator');
    } finally {
      setInviteLoading(false);
    }
  };
  
  // Set the campaign ID from URL parameter if present
  useEffect(() => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
    }
  }, [campaignId, setSelectedCampaignId]);

  // Transform creators from hook to match the Creator type from @/types/creator
  const transformedCreators: Creator[] = filteredCreators.map(creator => ({
    id: creator.id,
    name: creator.name,
    platform: creator.platform,
    audience: creator.audience,
    contentType: creator.contentType,
    followers: creator.followers,
    engagement: creator.engagement,
    priceRange: creator.priceRange,
    skills: creator.skills || [], // Ensure skills is always an array
    imageUrl: creator.imageUrl,
    bannerImageUrl: creator.bannerImageUrl,
    about: creator.about,
    socialLinks: creator.socialLinks,
    metrics: {
      // Use external API data when available, fallback to stored data
      followerCount: creator.externalMetrics?.followerCount?.toString() || creator.followers,
      engagementRate: creator.externalMetrics?.engagementRate ? `${creator.externalMetrics.engagementRate}%` : creator.engagement,
      avgViews: creator.externalMetrics?.avgViews?.toString() || "N/A",
      avgLikes: creator.externalMetrics?.avgLikes?.toString() || "N/A",
      growthTrend: creator.externalMetrics?.growthRate ? `${creator.externalMetrics.growthRate}%` : undefined
    },
    audienceLocation: creator.audienceLocation,
    industries: creator.industries
  }));

  // Transform selectedCreators to match the Creator type from @/types/creator
  const transformedSelectedCreators: Creator[] = selectedCreators.map(creator => ({
    id: creator.id,
    name: creator.name,
    platform: creator.platform,
    audience: creator.audience,
    contentType: creator.contentType,
    followers: creator.followers,
    engagement: creator.engagement,
    priceRange: creator.priceRange,
    skills: creator.skills || [], // Ensure skills is always an array
    imageUrl: creator.imageUrl,
    bannerImageUrl: creator.bannerImageUrl,
    about: creator.about,
    socialLinks: creator.socialLinks,
    metrics: {
      // Use external API data when available, fallback to stored data
      followerCount: creator.externalMetrics?.followerCount?.toString() || creator.followers,
      engagementRate: creator.externalMetrics?.engagementRate ? `${creator.externalMetrics.engagementRate}%` : creator.engagement,
      avgViews: creator.externalMetrics?.avgViews?.toString() || "N/A",
      avgLikes: creator.externalMetrics?.avgLikes?.toString() || "N/A",
      growthTrend: creator.externalMetrics?.growthRate ? `${creator.externalMetrics.growthRate}%` : undefined
    },
    audienceLocation: creator.audienceLocation,
    industries: creator.industries
  }));

  // Transform availableCampaigns to match expected type
  const campaignsForBar = availableCampaigns.map(campaign => ({
    id: campaign.id,
    title: campaign.name
  }));

  // Get selected creator IDs for components that expect number[]
  const selectedCreatorIds = selectedCreators.map(c => c.id);

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
              filterIndustries={filterIndustries}
              onIndustriesChange={setFilterIndustries}
              isFilterSheetOpen={isFilterSheetOpen}
              setIsFilterSheetOpen={setIsFilterSheetOpen}
              resetFilters={resetFilters}
              getActiveFilterCount={getActiveFilterCount}
            />
          </CardContent>
        </Card>
        
        {transformedSelectedCreators.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <SelectedCreatorsBar 
              selectedCreators={selectedCreatorIds}
              availableCampaigns={campaignsForBar}
              selectedCampaignId={selectedCampaignId}
              onSelectCampaign={setSelectedCampaignId}
              onAddToCart={addCreatorsToProject}
            />
          </div>
        )}
        
        <div className="relative min-h-[300px]">
          {transformedCreators.length === 0 ? (
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
              creators={transformedCreators}
              selectedCreators={selectedCreatorIds}
              onToggleCreator={(creatorId: number) => {
                const creator = filteredCreators.find(c => c.id === creatorId);
                if (creator) handleToggleCreator(creator);
              }}
              onViewProfile={handleViewCreatorProfile}
            />
          ) : (
            <CreatorList
              creators={transformedCreators}
              selectedCreators={selectedCreatorIds}
              onToggleCreator={(creatorId: number) => {
                const creator = filteredCreators.find(c => c.id === creatorId);
                if (creator) handleToggleCreator(creator);
              }}
              onViewProfile={handleViewCreatorProfile}
            />
          )}
        </div>
        
        <CreatorProfileModal 
          creator={selectedCreator ? {
            ...selectedCreator,
            skills: selectedCreator.skills || [], // Ensure skills is always an array
            metrics: {
              // Use external API data when available
              followerCount: selectedCreator.externalMetrics?.followerCount?.toString() || selectedCreator.followers,
              engagementRate: selectedCreator.externalMetrics?.engagementRate ? `${selectedCreator.externalMetrics.engagementRate}%` : selectedCreator.engagement,
              avgViews: selectedCreator.externalMetrics?.avgViews?.toString() || "N/A",
              avgLikes: selectedCreator.externalMetrics?.avgLikes?.toString() || "N/A",
              growthTrend: selectedCreator.externalMetrics?.growthRate ? `${selectedCreator.externalMetrics.growthRate}%` : undefined
            }
          } : null}
          isOpen={isProfileModalOpen} 
          onClose={handleCloseProfileModal}
          onInvite={handleInviteCreator}
          inviteLoading={inviteLoading}
          isLoading={isLoadingCreator}
        />
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
