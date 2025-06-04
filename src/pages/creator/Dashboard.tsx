
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

  // Create a safe profile object with default values
  const safeProfile = {
    is_profile_complete: profile?.is_profile_complete || false,
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    avatar_url: profile?.avatar_url || '',
    banner_url: profile?.banner_url || '',
    bio: profile?.bio || '',
    primary_platform: profile?.primary_platform || '',
    follower_count: profile?.follower_count || 0,
    engagement_rate: profile?.engagement_rate || 0,
    content_types: profile?.content_types || [],
    platforms: profile?.platforms || [],
    industries: profile?.industries || [],
    social_handles: profile?.social_handles || {},
    audience_location: profile?.audience_location || {},
    visibility_settings: profile?.visibility_settings || {
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
          user={user}
          profile={safeProfile}
          isProfileComplete={safeProfile.is_profile_complete}
          visibilitySettings={safeProfile.visibility_settings}
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
