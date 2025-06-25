
import React from 'react';
import DashboardContent from '@/components/creator/dashboard/DashboardContent';
import { CreatorIntroModal } from '@/components/creator/CreatorIntroModal';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { useCreatorIntro } from '@/hooks/creator/useCreatorIntro';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard = () => {
  const { user, role, isLoading: authLoading } = useUnifiedAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useCreatorProfile();
  const { showIntro, isLoading: introLoading, dismissIntro } = useCreatorIntro();

  console.log('Creator Dashboard Debug:', {
    user: !!user,
    role,
    profile: !!profile,
    authLoading,
    profileLoading,
    introLoading,
    profileError
  });

  // Show error state if there's a profile error
  if (profileError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500">Error loading profile data</p>
            <p className="text-sm text-muted-foreground mt-2">Please refresh the page</p>
          </div>
        </div>
      </div>
    );
  }

  // For super admins without creator profiles
  if (role === 'super_admin' && !profile && !profileLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-white">Creator Dashboard Preview</h2>
            <p className="text-muted-foreground">You are viewing the creator dashboard as a super admin.</p>
            <p className="text-sm text-muted-foreground mt-2">Create a creator profile to see the full dashboard experience.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6">
        <DashboardContent 
          profile={profile}
          isLoading={profileLoading}
          isEditing={false}
          isPreviewMode={role === 'super_admin'}
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

      {/* Creator Intro Modal - only show for actual creators */}
      {profile && !introLoading && (
        <CreatorIntroModal 
          isOpen={showIntro} 
          onClose={dismissIntro} 
        />
      )}
    </ErrorBoundary>
  );
};

export default Dashboard;
