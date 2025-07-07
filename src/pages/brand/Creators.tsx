
import React, { useState } from 'react';
import { useRealCreators } from '@/hooks/brand/useRealCreators';
import { useUnifiedCreatorFilters } from '@/hooks/brand/useUnifiedCreatorFilters';
import { CreatorsPageHeader } from '@/components/brand/creators/CreatorsPageHeader';
import { EnhancedCreatorFilters } from '@/components/brand/filters/EnhancedCreatorFilters';
import { CreatorsGrid } from '@/components/brand/creators/CreatorsGrid';
import { CreatorProfileModal } from '@/components/brand/creators/CreatorProfileModal';
import { FavoritesModal } from '@/components/brand/creators/FavoritesModal';

const BrandCreators = () => {
  // Fetch creators data
  const { data: creatorsData = [], isLoading } = useRealCreators();
  
  // Transform creators data to match the new interface
  const transformedCreators = creatorsData.map(creator => ({
    id: creator.id,
    name: creator.name,
    username: creator.username,
    platform: creator.platform,
    platforms: [creator.platform],
    followerCount: parseInt(creator.followers.replace(/[^\d]/g, '')) || 0,
    engagementRate: parseFloat(creator.engagement.replace('%', '')) || 0,
    contentTypes: creator.skills || [],
    industries: creator.industries || [],
    skills: creator.skills || [],
    audienceLocation: creator.audience,
    avatar: creator.imageUrl,
    bio: creator.bio,
    priceRange: { min: 250, max: 2000 }, // Mock data
    isAvailable: true,
    lastActive: new Date().toISOString()
  }));

  // Initialize filtering system
  const filterSystem = useUnifiedCreatorFilters(transformedCreators);

  // Local state for UI features
  const [favoriteCreators, setFavoriteCreators] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<any[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  const handleCreatorSelect = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setShowProfileModal(true);
  };

  const handleCreatorToggle = (creatorId: string) => {
    const creator = filterSystem.filteredCreators.find(c => c.id === creatorId);
    if (creator) {
      setSelectedCreators(prev => 
        prev.some(c => c.id === creatorId)
          ? prev.filter(c => c.id !== creatorId)
          : [...prev, creator]
      );
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <CreatorsPageHeader
            selectedCount={selectedCreators.length}
            favoriteCount={favoriteCreators.length}
            onShowFavorites={() => setShowFavoritesModal(true)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-8">
          {/* Enhanced Filters */}
          <EnhancedCreatorFilters
            filters={filterSystem.filters}
            updateFilter={filterSystem.updateFilter}
            resetFilters={filterSystem.resetFilters}
            getActiveFilterCount={filterSystem.getActiveFilterCount}
            isAdvancedOpen={filterSystem.isAdvancedOpen}
            setIsAdvancedOpen={filterSystem.setIsAdvancedOpen}
            resultCount={filterSystem.resultCount}
            totalCount={filterSystem.totalCount}
            savedFilters={filterSystem.savedFilters}
            saveFilterSet={filterSystem.saveFilterSet}
            loadFilterSet={filterSystem.loadFilterSet}
          />

          {/* Creators Grid */}
          <div className="min-h-[400px]">
            <CreatorsGrid
              creators={filterSystem.filteredCreators.map(creator => ({
                id: parseInt(creator.id),
                name: creator.name,
                platform: creator.platform,
                imageUrl: creator.avatar,
                followers: `${Math.floor(creator.followerCount / 1000)}K`,
                engagement: `${creator.engagementRate}%`,
                audience: creator.audienceLocation || 'Global',
                contentType: creator.contentTypes?.[0] || 'Mixed',
                priceRange: `$${creator.priceRange?.min || 250} - $${creator.priceRange?.max || 2000}`,
                skills: creator.skills || []
              }))}
              isLoading={isLoading}
              selectedCreators={selectedCreators}
              favoriteCreators={favoriteCreators}
              onCreatorSelect={handleCreatorSelect}
              onCreatorToggle={handleCreatorToggle}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatorProfileModal
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        creatorId={selectedCreatorId}
      />

      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favoriteCreators={favoriteCreators}
        creators={filterSystem.filteredCreators.map(creator => ({
          id: parseInt(creator.id),
          name: creator.name,
          platform: creator.platform,
          imageUrl: creator.avatar,
          followers: `${Math.floor(creator.followerCount / 1000)}K`,
          engagement: `${creator.engagementRate}%`,
          audience: creator.audienceLocation || 'Global',
          contentType: creator.contentTypes?.[0] || 'Mixed',
          priceRange: `$${creator.priceRange?.min || 250} - $${creator.priceRange?.max || 2000}`,
          skills: creator.skills || []
        }))}
      />
    </div>
  );
};

export default BrandCreators;
