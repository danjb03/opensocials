
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BrandLayout from '@/components/layouts/BrandLayout';
import { CreatorFilters } from '@/components/brand/creator-search/CreatorFilters';
import { CreatorList } from '@/components/brand/creator-search/CreatorList';
import { CreatorGrid } from '@/components/brand/creator-search/CreatorGrid';
import { SelectedCreatorsBar } from '@/components/brand/creator-search/SelectedCreatorsBar';
import { ViewToggle } from '@/components/brand/creator-search/ViewToggle';
import { CreatorProfileModal } from '@/components/brand/creator-search/CreatorProfileModal';
import { CreatorFavoritesModal } from '@/components/brand/creator-search/CreatorFavoritesModal';
import { useCreatorSearchNew } from '@/hooks/useCreatorSearchNew';
import { useCreatorProfileModal } from '@/hooks/useCreatorProfileModal';
import { useCreatorFavorites } from '@/hooks/useCreatorFavorites';
import { useCreatorInvitationActions } from '@/hooks/useCreatorInvitationActions';
import { useSearchParams } from 'react-router-dom';
import { Creator } from '@/types/creator';
import { Heart } from 'lucide-react';

const CreatorSearch = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  
  const {
    creators,
    isLoading,
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
    handleToggleCreator,
    addCreatorsToProject,
    resetFilters,
    getActiveFilterCount,
    availableCampaigns,
    selectedCampaignId,
    setSelectedCampaignId
  } = useCreatorSearchNew();

  const { isFavorite, toggleFavorite, isToggling } = useCreatorFavorites();
  const { handleInviteCreator } = useCreatorInvitationActions();

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

  // Transform creators to match the Creator type from @/types/creator
  const transformedCreators: Creator[] = creators.map(creator => ({
    id: parseInt(creator.user_id), // Convert string to number for compatibility
    name: creator.display_name || 'Unknown Creator',
    platform: creator.primary_platform || 'Unknown',
    audience: creator.audience_type || 'Unknown',
    contentType: creator.content_type || 'Unknown',
    followers: creator.follower_count?.toString() || '0',
    engagement: creator.engagement_rate ? `${creator.engagement_rate}%` : '0%',
    priceRange: '$500 - $2,000', // Default pricing range
    skills: creator.content_types || [],
    imageUrl: creator.avatar_url || '/placeholder.svg',
    bannerImageUrl: undefined,
    about: creator.bio || '',
    socialLinks: {},
    metrics: {
      followerCount: creator.follower_count?.toString() || '0',
      engagementRate: creator.engagement_rate ? `${creator.engagement_rate}%` : '0%',
      avgViews: "N/A",
      avgLikes: "N/A",
      growthTrend: undefined
    },
    audienceLocation: creator.audience_location,
    industries: creator.industries || []
  }));

  // Transform selectedCreators to match the Creator type
  const transformedSelectedCreators: Creator[] = selectedCreators.map(creator => ({
    id: parseInt(creator.user_id),
    name: creator.display_name || 'Unknown Creator',
    platform: creator.primary_platform || 'Unknown',
    audience: creator.audience_type || 'Unknown',
    contentType: creator.content_type || 'Unknown',
    followers: creator.follower_count?.toString() || '0',
    engagement: creator.engagement_rate ? `${creator.engagement_rate}%` : '0%',
    priceRange: '$500 - $2,000',
    skills: creator.content_types || [],
    imageUrl: creator.avatar_url || '/placeholder.svg',
    bannerImageUrl: undefined,
    about: creator.bio || '',
    socialLinks: {},
    metrics: {
      followerCount: creator.follower_count?.toString() || '0',
      engagementRate: creator.engagement_rate ? `${creator.engagement_rate}%` : '0%',
      avgViews: "N/A",
      avgLikes: "N/A",
      growthTrend: undefined
    },
    audienceLocation: creator.audience_location,
    industries: creator.industries || []
  }));

  // Transform availableCampaigns to match expected type
  const campaignsForBar = availableCampaigns.map(campaign => ({
    id: campaign.id,
    title: campaign.name
  }));

  // Get selected creator IDs for components that expect number[]
  const selectedCreatorIds = selectedCreators.map(c => parseInt(c.user_id));

  const handleCreatorToggle = (creatorId: number) => {
    const creator = creators.find(c => parseInt(c.user_id) === creatorId);
    if (creator) handleToggleCreator(creator);
  };

  const handleViewProfile = (creatorId: number) => {
    const creator = creators.find(c => parseInt(c.user_id) === creatorId);
    if (creator) {
      // Convert to the format expected by useCreatorProfileModal
      const profileCreator = {
        id: parseInt(creator.user_id),
        name: creator.display_name || 'Unknown Creator',
        platform: creator.primary_platform || 'Unknown',
        audience: creator.audience_type || 'Unknown',
        contentType: creator.content_type || 'Unknown',
        followers: creator.follower_count?.toString() || '0',
        engagement: creator.engagement_rate ? `${creator.engagement_rate}%` : '0%',
        priceRange: '$500 - $2,000',
        skills: creator.content_types || [],
        imageUrl: creator.avatar_url || '/placeholder.svg',
        bannerImageUrl: undefined,
        about: creator.bio || '',
        socialLinks: {},
        externalMetrics: undefined,
        industries: creator.industries || [],
        audienceLocation: creator.audience_location
      };
      handleViewCreatorProfile(profileCreator.id);
    }
  };

  const handleFavoriteToggle = (creatorId: number) => {
    const creator = creators.find(c => parseInt(c.user_id) === creatorId);
    if (creator) {
      toggleFavorite(creator.user_id);
    }
  };

  const handleInviteFromModal = (creatorId: string, creatorName: string) => {
    handleInviteCreator(creatorId, creatorName);
    setShowFavoritesModal(false);
  };

  return (
    <BrandLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl bg-background">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Find Creators</h1>
            <p className="text-foreground">Instantly see who's right for your campaign</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFavoritesModal(true)}
              className="flex items-center gap-2 text-foreground"
            >
              <Heart className="h-4 w-4" />
              Your Creator Lists
            </Button>
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          </div>
        </div>
        
        <Card className="mb-8 shadow-sm overflow-hidden">
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
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : transformedCreators.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-foreground">No creators found</h3>
                <p className="mt-1 text-sm text-foreground">Try adjusting your search or filter criteria.</p>
                <div className="mt-6">
                  <Button onClick={resetFilters} variant="outline" className="text-foreground">
                    Clear all filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <CreatorGrid 
              creators={transformedCreators} 
              selectedCreators={selectedCreatorIds} 
              onToggleCreator={handleCreatorToggle}
              onViewProfile={handleViewProfile} 
            />
          ) : (
            <CreatorList 
              creators={transformedCreators} 
              selectedCreators={selectedCreatorIds} 
              onToggleCreator={handleCreatorToggle}
              onViewProfile={handleViewProfile} 
            />
          )}
        </div>
        
        <CreatorProfileModal 
          creator={selectedCreator ? {
            ...selectedCreator,
            skills: selectedCreator.skills || [],
            metrics: {
              followerCount: selectedCreator.followers,
              engagementRate: selectedCreator.engagement,
              avgViews: "N/A",
              avgLikes: "N/A",
              growthTrend: undefined
            }
          } : null} 
          isOpen={isProfileModalOpen} 
          onClose={handleCloseProfileModal} 
          onInvite={(creatorId: number) => {
            const creator = creators.find(c => parseInt(c.user_id) === creatorId);
            if (creator) {
              handleInviteCreator(creator.user_id, creator.display_name || 'Creator');
            }
          }}
          inviteLoading={false}
          isLoading={isLoadingCreator} 
        />

        <CreatorFavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
          onInviteCreator={handleInviteFromModal}
        />
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
