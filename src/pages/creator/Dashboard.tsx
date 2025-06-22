
import React from 'react';
import CreatorLayout from '@/components/layouts/CreatorLayout';
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

  const isLoading = authLoading || profileLoading || introLoading;

  console.log('Creator Dashboard Debug:', {
    user: !!user,
    role,
    profile: !!profile,
    isLoading,
    authLoading,
    profileLoading,
    introLoading,
    profileError
  });

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading your dashboard...</p>
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
              <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Authenticating...</p>
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

  // For super admins without creator profiles
  if (role === 'super_admin' && !profile) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">Creator Dashboard Preview</h2>
              <p className="text-muted-foreground">You are viewing the creator dashboard as a super admin.</p>
              <p className="text-sm text-muted-foreground mt-2">Create a creator profile to see the full dashboard experience.</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <ErrorBoundary>
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <DashboardContent 
            profile={profile}
            isLoading={false}
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
      </CreatorLayout>

      {/* Creator Intro Modal - only show for actual creators */}
      {profile && (
        <CreatorIntroModal 
          isOpen={showIntro} 
          onClose={dismissIntro} 
        />
      )}
    </ErrorBoundary>
  );
};

export default Dashboard;
