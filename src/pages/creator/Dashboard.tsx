
import React from 'react';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import DashboardContent from '@/components/creator/dashboard/DashboardContent';
import { CreatorIntroModal } from '@/components/creator/CreatorIntroModal';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorIntro } from '@/hooks/creator/useCreatorIntro';

const Dashboard = () => {
  const { user, profile, isLoading } = useCreatorAuth();
  const { showIntro, isLoading: introLoading, dismissIntro } = useCreatorIntro();

  if (isLoading || introLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  // If user doesn't exist, show loading state
  if (!user) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p>Authenticating...</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  // Create a safe profile object using the correct property names from CreatorProfile interface
  const safeProfile = {
    isProfileComplete: profile?.is_profile_complete || false,
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    avatarUrl: profile?.avatar_url || '',
    bannerUrl: profile?.banner_url || '',
    bio: profile?.bio || '',
    primaryPlatform: profile?.primary_platform || '',
    followerCount: profile?.audience_size || 0,
    engagementRate: profile?.engagement_rate || 0,
    contentTypes: profile?.content_types || [],
    platforms: profile?.platforms || [],
    industries: profile?.industries || [],
    socialHandles: profile?.social_handles || {},
    audienceLocation: profile?.audience_location || {},
    visibilitySettings: profile?.visibility_settings || {
      showTiktok: true,
      showYoutube: true,
      showLinkedin: true,
      showLocation: true,
      showAnalytics: true,
      showInstagram: true
    }
  };

  return (
    <>
      <CreatorLayout>
        <DashboardContent 
          profile={safeProfile}
          isLoading={isLoading}
          isEditing={false}
          isPreviewMode={false}
          totalEarnings={0}
          pipelineValue={0}
          connectionStats={{
            outreach: 0,
            in_talks: 0,
            working: 0
          }}
          earningsData={[]}
          platformAnalytics={{}}
          onProfileSubmit={async () => {}}
          onCancelEdit={() => {}}
          onStartProfileSetup={() => {}}
          onAvatarChange={() => {}}
          onConnectPlatform={() => {}}
        />
      </CreatorLayout>

      {/* Creator Intro Modal */}
      <CreatorIntroModal 
        isOpen={showIntro} 
        onClose={dismissIntro} 
      />
    </>
  );
};

export default Dashboard;
