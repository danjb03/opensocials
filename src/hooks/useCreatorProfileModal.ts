
import { useState } from 'react';
import { useCreatorData } from './creator-profile-modal/useCreatorData';
import { transformCreatorData, createFallbackCreator } from './creator-profile-modal/creatorTransforms';
import { CreatorModalData } from './creator-profile-modal/types';

export const useCreatorProfileModal = () => {
  const [selectedCreator, setSelectedCreator] = useState<CreatorModalData | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const { fetchCreatorProfile, isLoadingCreator } = useCreatorData();

  const handleViewCreatorProfile = async (userId: string) => {
    console.log('handleViewCreatorProfile called with userId:', userId);
    
    setIsProfileModalOpen(true);
    setSelectedCreator(null);

    const { creatorData, analyticsData, creatorError } = await fetchCreatorProfile(userId);

    if (creatorError) {
      console.error('Error fetching creator for modal:', creatorError);
      setSelectedCreator(createFallbackCreator());
      return;
    }

    if (creatorData) {
      const transformedCreator = transformCreatorData(creatorData, analyticsData);
      console.log('Setting live creator data:', transformedCreator);
      setSelectedCreator(transformedCreator);
    } else {
      setSelectedCreator(createFallbackCreator('Error Loading Profile'));
    }
  };

  const handleCloseProfileModal = () => {
    console.log('Closing profile modal');
    setIsProfileModalOpen(false);
    setSelectedCreator(null);
  };

  return {
    selectedCreator,
    isProfileModalOpen,
    isLoadingCreator,
    handleViewCreatorProfile,
    handleCloseProfileModal
  };
};
