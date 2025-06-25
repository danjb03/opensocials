
import React from 'react';
import CreatorProfileCard from '@/components/creator/CreatorProfileCard';

interface CreatorForCard {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  primaryPlatform: string;
  platforms: string[];
  industries: string[];
  audienceLocation: any;
  followerCount: number;
  engagementRate: number;
  creatorType: string;
}

interface ProfilePreviewTabProps {
  creatorForCard: CreatorForCard;
}

const ProfilePreviewTab: React.FC<ProfilePreviewTabProps> = ({ creatorForCard }) => {
  return (
    <>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Brand View</h2>
        <p className="text-muted-foreground">
          This is how brands will see your profile when they discover you
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="max-w-md">
          <CreatorProfileCard 
            creator={creatorForCard}
            onInvite={() => {}}
            onViewProfile={() => {}}
            showActions={true}
          />
        </div>
      </div>
    </>
  );
};

export default ProfilePreviewTab;
