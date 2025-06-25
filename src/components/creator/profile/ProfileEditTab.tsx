
import React from 'react';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import { CreatorProfile } from '@/types/creatorProfile';

interface ProfileEditTabProps {
  profileData: CreatorProfile | null;
  onSave: (updatedProfile: any) => Promise<void>;
  onCancel: () => void;
}

const ProfileEditTab: React.FC<ProfileEditTabProps> = ({ 
  profileData, 
  onSave, 
  onCancel 
}) => {
  if (!profileData) {
    return <div>Loading profile data...</div>;
  }

  return (
    <ProfileEditForm
      profile={profileData}
      isLoading={false}
      onSubmit={onSave}
      onCancel={onCancel}
    />
  );
};

export default ProfileEditTab;
