
import { useState, useEffect } from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { CreatorSearchHeader } from '@/components/brand/creator-search/CreatorSearchHeader';
import { CreatorSearchFilters } from '@/components/brand/creator-search/CreatorSearchFilters';
import { CreatorSearchResults } from '@/components/brand/creator-search/CreatorSearchResults';
import { CreatorSearchModals } from '@/components/brand/creator-search/CreatorSearchModals';
import { useCreatorSearchNew } from '@/hooks/useCreatorSearchNew';
import { useCreatorProfileModal } from '@/hooks/useCreatorProfileModal';
import { useCreatorFavorites } from '@/hooks/useCreatorFavorites';
import { useCreatorInvitationActions } from '@/hooks/useCreatorInvitationActions';
import { useCreatorSearchHandlers } from '@/hooks/useCreatorSearchHandlers';
import { useSearchParams } from 'react-router-dom';

const CreatorSearch = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  
  const searchHookData = useCreatorSearchNew();
  const { isFavorite, toggleFavorite, isToggling } = useCreatorFavorites();
  const { handleInviteCreator } = useCreatorInvitationActions();
  const profileModalData = useCreatorProfileModal();

  const {
    transformedCreators,
    transformedSelectedCreators,
    campaignsForBar,
    selectedCreatorIds,
    handlers
  } = useCreatorSearchHandlers({
    searchHookData,
    profileModalData,
    handleInviteCreator,
    setShowFavoritesModal
  });

  // Set the campaign ID from URL parameter if present
  useEffect(() => {
    if (campaignId) {
      searchHookData.setSelectedCampaignId(campaignId);
    }
  }, [campaignId, searchHookData.setSelectedCampaignId]);

  return (
    <BrandLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl bg-background">
        <CreatorSearchHeader
          viewMode={viewMode}
          onViewChange={setViewMode}
          onShowFavorites={() => setShowFavoritesModal(true)}
        />
        
        <CreatorSearchFilters searchHookData={searchHookData} />
        
        <CreatorSearchResults
          searchHookData={searchHookData}
          transformedCreators={transformedCreators}
          transformedSelectedCreators={transformedSelectedCreators}
          campaignsForBar={campaignsForBar}
          selectedCreatorIds={selectedCreatorIds}
          viewMode={viewMode}
          handlers={handlers}
        />
        
        <CreatorSearchModals
          profileModalData={profileModalData}
          showFavoritesModal={showFavoritesModal}
          onCloseFavoritesModal={() => setShowFavoritesModal(false)}
          onInviteFromModal={handlers.handleInviteFromModal}
          onInviteFromProfile={handlers.handleInviteFromProfile}
        />
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
