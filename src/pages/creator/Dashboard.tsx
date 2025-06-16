
import React from 'react';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import DashboardContent from '@/components/creator/dashboard/DashboardContent';
import { CreatorIntroModal } from '@/components/creator/CreatorIntroModal';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { useCreatorIntro } from '@/hooks/creator/useCreatorIntro';

const Dashboard = () => {
  const { user, isLoading: authLoading } = useCreatorAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useCreatorProfile();
  const { showIntro, isLoading: introLoading, dismissIntro } = useCreatorIntro();

  const isLoading = authLoading || profileLoading || introLoading;

  if (isLoading) {
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

  // Show error state if there's a profile error
  if (profileError) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500">Error loading profile data</p>
              <p className="text-sm text-muted-foreground mt-2">Please refresh the page</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <>
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <DashboardContent 
            profile={profile}
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
        </div>
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
