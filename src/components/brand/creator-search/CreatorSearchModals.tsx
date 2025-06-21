
import { CreatorProfileModal } from './CreatorProfileModal';
import { CreatorFavoritesModal } from './CreatorFavoritesModal';

interface CreatorSearchModalsProps {
  profileModalData: any;
  showFavoritesModal: boolean;
  onCloseFavoritesModal: () => void;
  onInviteFromModal: (creatorId: string, creatorName: string) => void;
  onInviteFromProfile: (creatorId: number) => void;
}

export const CreatorSearchModals = ({
  profileModalData,
  showFavoritesModal,
  onCloseFavoritesModal,
  onInviteFromModal,
  onInviteFromProfile
}: CreatorSearchModalsProps) => {
  const { selectedCreator, isProfileModalOpen, isLoadingCreator, handleCloseProfileModal } = profileModalData;

  return (
    <>
      <CreatorProfileModal 
        creator={selectedCreator ? {
          ...selectedCreator,
          skills: selectedCreator.skills || [],
          metrics: {
            followerCount: selectedCreator.followers || '0',
            engagementRate: selectedCreator.engagement || '0%',
            avgViews: "N/A",
            avgLikes: "N/A",
            growthTrend: undefined
          }
        } : null} 
        isOpen={isProfileModalOpen} 
        onClose={handleCloseProfileModal} 
        onInvite={onInviteFromProfile}
        inviteLoading={false}
        isLoading={isLoadingCreator} 
      />

      <CreatorFavoritesModal
        isOpen={showFavoritesModal}
        onClose={onCloseFavoritesModal}
        onInviteCreator={onInviteFromModal}
      />
    </>
  );
};
