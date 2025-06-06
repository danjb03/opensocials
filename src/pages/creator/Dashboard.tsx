
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

  // Create a safe profile object using any type to bypass TypeScript errors for database fields
  const rawProfile = profile as any;
  const safeProfile = {
    isProfileComplete: rawProfile?.is_profile_complete || false,
    firstName: rawProfile?.first_name || '',
    lastName: rawProfile?.last_name || '',
    avatarUrl: rawProfile?.avatar_url || '',
    bannerUrl: rawProfile?.banner_url || '',
    bio: rawProfile?.bio || '',
    primaryPlatform: rawProfile?.primary_platform || '',
    followerCount: rawProfile?.audience_size || 0,
    engagementRate: rawProfile?.engagement_rate || 0,
    contentTypes: rawProfile?.content_types || [],
    platforms: rawProfile?.platforms || [],
    industries: rawProfile?.industries || [],
    socialHandles: rawProfile?.social_handles || {},
    audienceLocation: rawProfile?.audience_location || {},
    visibilitySettings: rawProfile?.visibility_settings || {
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
