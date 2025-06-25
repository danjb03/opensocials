
import React from 'react';
import CreatorProfileCard from '@/components/creator/CreatorProfileCard';
import ProfileQuickStats from './ProfileQuickStats';

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

interface ProfileOverviewTabProps {
  creatorForCard: CreatorForCard;
  creatorProfile: any;
}

const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({ 
  creatorForCard, 
  creatorProfile 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Card Preview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Profile Preview</h2>
        <CreatorProfileCard 
          creator={creatorForCard}
          showActions={false}
        />
      </div>

      {/* Quick Stats */}
      <ProfileQuickStats creatorProfile={creatorProfile} />
    </div>
  );
};

export default ProfileOverviewTab;
