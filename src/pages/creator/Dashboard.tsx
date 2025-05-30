import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import CreatorProfileHeader from '@/components/creator/CreatorProfileHeader';
import VisibilityControls from '@/components/creator/VisibilityControls';
import DashboardContent from '@/components/creator/dashboard/DashboardContent';
import { CreatorIntroModal } from '@/components/creator/CreatorIntroModal';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { useCreatorIntro } from '@/hooks/creator/useCreatorIntro';
import { InsightIQProvider } from '@/components/creator/InsightIQProvider';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { 
    profile, 
    isLoading, 
    isEditing, 
    setIsEditing,
    isPreviewMode,
    setIsPreviewMode,
    isUploading,
    updateProfile,
    uploadAvatar,
    toggleVisibilitySetting,
    connectSocialPlatform,
    platformAnalytics
  } = useCreatorProfile();

  // Creator intro modal logic
  const { showIntro, isLoading: introLoading, dismissIntro } = useCreatorIntro();

  const handleProfileSubmit = async (values: any) => {
    try {
      console.log('Submitting profile with values:', values);
      
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio,
        primaryPlatform: values.primaryPlatform,
        contentType: values.contentType,
        audienceType: values.audienceType,
        audienceLocation: {
          primary: values.audienceLocation?.primary || values.audienceLocation || 'Global',
          secondary: profile?.audienceLocation?.secondary || [],
          countries: profile?.audienceLocation?.countries || [
            { name: 'United States', percentage: 30 },
            { name: 'United Kingdom', percentage: 20 },
            { name: 'Canada', percentage: 15 },
            { name: 'Australia', percentage: 10 },
            { name: 'Others', percentage: 25 }
          ]
        },
        industries: values.industries || [],
        creatorType: values.creatorType || '',
        isProfileComplete: true
      });
      
      console.log('Profile submitted successfully, setting editing to false');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Error is already handled in updateProfile
    }
  };

  const handleStartProfileSetup = () => {
    console.log('Starting profile setup');
    setIsEditing(true);
  };

  const handleEditProfile = () => {
    console.log('Editing profile');
    setIsEditing(true);
    setIsPreviewMode(false);
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      setIsEditing(false);
    }
  };

  const handleOAuthConnect = async (platform: string) => {
    try {
      await connectSocialPlatform(platform);
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    }
  };

  console.log('Dashboard render - profile:', profile, 'isLoading:', isLoading, 'isEditing:', isEditing);

  // Show intro modal loading state
  if (introLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <>
      <CreatorLayout>
        <InsightIQProvider>
          <div className="container mx-auto p-6 space-y-6">
            {profile && profile.isProfileComplete && !isEditing && (
              <CreatorProfileHeader 
                name={`${profile.firstName} ${profile.lastName}`}
                imageUrl={profile?.avatarUrl || undefined}
                bannerUrl={profile?.bannerUrl || undefined}
                bio={profile?.bio || 'No bio yet. Add one to complete your profile.'}
                platform={profile?.primaryPlatform}
                followers={profile?.followerCount}
                isEditable={true}
                onEditProfile={handleEditProfile}
                onTogglePreview={handleTogglePreview}
                isPreviewMode={isPreviewMode}
                onAvatarChange={uploadAvatar}
                isUploading={isUploading}
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <DashboardContent 
                  profile={profile}
                  isLoading={isLoading}
                  isEditing={isEditing}
                  isPreviewMode={isPreviewMode}
                  totalEarnings={0}
                  pipelineValue={0}
                  connectionStats={{
                    outreach: 0,
                    in_talks: 0,
                    working: 0,
                  }}
                  earningsData={[]}
                  platformAnalytics={platformAnalytics}
                  onProfileSubmit={handleProfileSubmit}
                  onCancelEdit={() => setIsEditing(false)}
                  onStartProfileSetup={handleStartProfileSetup}
                  onAvatarChange={uploadAvatar}
                  onConnectPlatform={handleOAuthConnect}
                />
              </div>
              
              <div className="lg:col-span-1">
                {profile && profile.isProfileComplete && !isEditing && (
                  <VisibilityControls 
                    visibilitySettings={profile?.visibilitySettings || {
                      showInstagram: true,
                      showTiktok: true,
                      showYoutube: true,
                      showLinkedin: true,
                      showLocation: true,
                      showAnalytics: true
                    }}
                    onToggleVisibility={toggleVisibilitySetting}
                  />
                )}
              </div>
            </div>
          </div>
        </InsightIQProvider>
      </CreatorLayout>

      {/* Creator Intro Modal */}
      <CreatorIntroModal 
        isOpen={showIntro} 
        onClose={dismissIntro} 
      />
    </>
  );
};

export default CreatorDashboard;
