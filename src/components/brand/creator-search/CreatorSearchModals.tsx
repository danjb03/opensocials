
import { CreatorProfileModal } from './CreatorProfileModal';
import { CreatorFavoritesModal } from './CreatorFavoritesModal';

interface CreatorSearchModalsProps {
  profileModalData: any;
  showFavoritesModal: boolean;
  onCloseFavoritesModal: () => void;
  onInviteFromModal: (creatorId: string, creatorName: string) => void;
  onInviteFromProfile: (creatorId: string) => void;
}

export const CreatorSearchModals = ({
  profileModalData,
  showFavoritesModal,
  onCloseFavoritesModal,
  onInviteFromModal,
  onInviteFromProfile
}: CreatorSearchModalsProps) => {
  const { selectedCreator, isProfileModalOpen, isLoadingCreator, handleCloseProfileModal } = profileModalData;

  console.log('CreatorSearchModals render - isProfileModalOpen:', isProfileModalOpen, 'selectedCreator:', selectedCreator);

  return (
    <>
      <CreatorProfileModal 
        creator={selectedCreator} 
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
