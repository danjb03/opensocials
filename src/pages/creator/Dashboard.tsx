
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

  const isLoading = authLoading || profileLoading || introLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
              <p className="text-foreground font-light">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
              <p className="text-foreground font-light">Authenticating...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <p className="text-red-400 text-lg">Error loading profile data</p>
              <p className="text-sm text-muted-foreground">Please refresh the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'super_admin' && !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-light text-foreground">Creator Dashboard Preview</h2>
              <p className="text-muted-foreground">You are viewing the creator dashboard as a super admin.</p>
              <p className="text-sm text-muted-foreground">Create a creator profile to see the full dashboard experience.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
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

        {profile && (
          <CreatorIntroModal 
            isOpen={showIntro} 
            onClose={dismissIntro} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
