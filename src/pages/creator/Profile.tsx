
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Settings } from 'lucide-react';
import { useCreatorProfileData } from '@/hooks/useCreatorProfileData';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ProfileHeader from '@/components/creator/profile/ProfileHeader';
import ProfileOverviewTab from '@/components/creator/profile/ProfileOverviewTab';
import ProfileEditTab from '@/components/creator/profile/ProfileEditTab';

const CreatorProfile = () => {
  const { user, creatorProfile } = useUnifiedAuth();
  const { profile: profileData, isLoading: profileDataLoading } = useCreatorProfileData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  console.log('🔍 Creator Profile Debug:', {
    user: !!user,
    creatorProfile: !!creatorProfile,
    profileData: !!profileData,
    isLoading: profileDataLoading
  });

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
  // Safely access the database fields (snake_case) from useUnifiedAuth
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
    // Use the database fields with proper fallbacks
    followerCount: creatorProfile?.follower_count || 0,
    engagementRate: creatorProfile?.engagement_rate || 0,
    creatorType: creatorProfile?.creator_type || '',
  };

  // Create a safe profile data object that matches what the edit form expects
  // Use the transformed camelCase properties from useCreatorProfileData
  const safeProfileData = profileData ? {
    ...profileData,
    platforms: profileData.platforms || [],
    // Use the camelCase properties from the transformed CreatorProfile
    followerCount: profileData.followerCount || '0',
    engagementRate: profileData.engagementRate || '0%',
    creatorType: profileData.creatorType || '',
    visibilitySettings: profileData.visibilitySettings || {
      showInstagram: true,
      showTiktok: true,
      showYoutube: true,
      showLinkedin: true,
      showLocation: true,
      showAnalytics: true
    }
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
