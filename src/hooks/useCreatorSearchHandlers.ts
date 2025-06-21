
import { useMemo } from 'react';
import { Creator } from '@/types/creator';

interface UseCreatorSearchHandlersProps {
  searchHookData: any;
  profileModalData: any;
  handleInviteCreator: (creatorId: string, creatorName: string) => void;
  setShowFavoritesModal: (show: boolean) => void;
}

export const useCreatorSearchHandlers = ({
  searchHookData,
  profileModalData,
  handleInviteCreator,
  setShowFavoritesModal
}: UseCreatorSearchHandlersProps) => {
  const { creators, selectedCreators, availableCampaigns, handleToggleCreator } = searchHookData;
  const { handleViewCreatorProfile } = profileModalData;

  // Transform creators to match the Creator type from @/types/creator
  const transformedCreators: Creator[] = useMemo(() => 
    creators.map((creator: any) => ({
      id: creator.user_id, // Keep as string UUID
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
    })), [creators]);

  // Transform selectedCreators to match the Creator type
  const transformedSelectedCreators: Creator[] = useMemo(() =>
    selectedCreators.map((creator: any) => ({
      id: creator.user_id, // Keep as string UUID
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
    })), [selectedCreators]);

  // Transform availableCampaigns to match expected type
  const campaignsForBar = useMemo(() =>
    availableCampaigns.map((campaign: any) => ({
      id: campaign.id,
      title: campaign.name
    })), [availableCampaigns]);

  // Get selected creator IDs as strings
  const selectedCreatorIds = useMemo(() =>
    selectedCreators.map((c: any) => c.user_id), [selectedCreators]);

  const handleCreatorToggle = (creatorId: string) => {
    const creator = creators.find((c: any) => c.user_id === creatorId);
    if (creator) handleToggleCreator(creator);
  };

  const handleViewProfile = (creatorId: string) => {
    console.log('handleViewProfile called with creatorId:', creatorId);
    const creator = creators.find((c: any) => c.user_id === creatorId);
    console.log('Found creator:', creator);
    
    if (creator) {
      console.log('Calling handleViewCreatorProfile with user_id:', creator.user_id);
      handleViewCreatorProfile(creator.user_id);
    } else {
      console.error('Creator not found for ID:', creatorId);
    }
  };

  const handleFavoriteToggle = (creatorId: string) => {
    const creator = creators.find((c: any) => c.user_id === creatorId);
    if (creator) {
      // toggleFavorite(creator.user_id); // This would need to be passed as prop if needed
    }
  };

  const handleInviteFromModal = (creatorId: string, creatorName: string) => {
    handleInviteCreator(creatorId, creatorName);
    setShowFavoritesModal(false);
  };

  const handleInviteFromProfile = (creatorId: string) => {
    const creator = creators.find((c: any) => c.user_id === creatorId);
    if (creator) {
      handleInviteCreator(creator.user_id, creator.display_name || 'Creator');
    }
  };

  return {
    transformedCreators,
    transformedSelectedCreators,
    campaignsForBar,
    selectedCreatorIds,
    handlers: {
      handleCreatorToggle,
      handleViewProfile,
      handleFavoriteToggle,
      handleInviteFromModal,
      handleInviteFromProfile
    }
  };
};
