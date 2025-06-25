
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Settings } from 'lucide-react';
import { useCreatorProfileData } from '@/hooks/useCreatorProfileData';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ProfileHeader from '@/components/creator/profile/ProfileHeader';
import ProfileOverviewTab from '@/components/creator/profile/ProfileOverviewTab';
import ProfileEditTab from '@/components/creator/profile/ProfileEditTab';

const CreatorProfile = () => {
  const { user, creatorProfile } = useUnifiedAuth();
  const { data: profileData, isLoading: profileDataLoading } = useCreatorProfileData();
  const { data: detailedProfile } = useCreatorProfile();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  if (profileDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    setActiveTab('edit');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setActiveTab('overview');
  };

  const handleSaveProfile = async (updatedProfile: any) => {
    // Profile saving logic would go here
    setIsEditing(false);
    setActiveTab('overview');
  };

  // Transform creator profile for the card using the unified auth data
  const creatorForCard = {
    id: user?.id || '',
    firstName: creatorProfile?.first_name || '',
    lastName: creatorProfile?.last_name || '',
    username: creatorProfile?.username || '',
    bio: creatorProfile?.bio || '',
    avatarUrl: creatorProfile?.avatar_url || '',
    primaryPlatform: creatorProfile?.primary_platform || '',
    platforms: creatorProfile?.platforms || [],
    industries: creatorProfile?.industries || [],
    audienceLocation: creatorProfile?.audience_location,
    // Use database fields directly from creatorProfile
    followerCount: creatorProfile?.follower_count || 0,
    engagementRate: creatorProfile?.engagement_rate || 0,
    creatorType: creatorProfile?.creator_type || '',
  };

  // Create a safe profile data object that matches what the edit form expects
  const safeProfileData = profileData ? {
    id: user?.id || '',
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    bio: profileData.bio,
    avatarUrl: profileData.avatarUrl,
    bannerUrl: profileData.bannerUrl,
    primaryPlatform: profileData.primaryPlatform,
    contentType: profileData.contentTypes?.[0] || '',
    audienceType: '',
    followerCount: profileData.followerCount,
    engagementRate: profileData.engagementRate,
    isProfileComplete: true,
    socialConnections: {
      instagram: false,
      tiktok: false,
      youtube: false,
      linkedin: false
    },
    visibilitySettings: profileData.visibilitySettings,
    audienceLocation: {
      primary: 'Global',
      secondary: [],
      countries: []
    },
    industries: profileData.industries,
    creatorType: profileData.creatorType,
    platforms: profileData.platforms,
    username: profileData.username
  } : null;

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <ProfileHeader onEditProfile={handleEditProfile} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="edit" disabled={!isEditing}>
            <Settings className="w-4 h-4" />
            Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProfileOverviewTab 
            creatorForCard={creatorForCard}
            creatorProfile={creatorProfile}
          />
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          <ProfileEditTab
            profileData={safeProfileData}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorProfile;
