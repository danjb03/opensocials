
import React from 'react';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import EmptyProfileState from '@/components/creator/EmptyProfileState';
import DashboardStats from './DashboardStats';
import EarningsChart from './EarningsChart';
import WelcomeSection from './WelcomeSection';
import UpdatesSection from './UpdatesSection';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CreatorProfile } from '@/hooks/useCreatorProfile';

interface DashboardContentProps {
  profile: CreatorProfile | null;
  isLoading: boolean;
  isEditing: boolean;
  isPreviewMode: boolean;
  totalEarnings: number;
  pipelineValue: number;
  connectionStats: {
    outreach: number;
    in_talks: number;
    working: number;
  };
  earningsData: {
    date: string;
    amount: number;
  }[];
  platformAnalytics: {
    instagram?: { followers: string; engagement: string; growth: string };
    tiktok?: { followers: string; engagement: string; growth: string };
    youtube?: { followers: string; engagement: string; growth: string };
  };
  onProfileSubmit: (values: Partial<CreatorProfile>) => Promise<void>;
  onCancelEdit: () => void;
  onStartProfileSetup: () => void;
  onAvatarChange: (file: File) => void;
  onConnectPlatform: (platform: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  profile,
  isLoading,
  isEditing,
  isPreviewMode,
  totalEarnings,
  pipelineValue,
  connectionStats,
  earningsData,
  onProfileSubmit,
  onCancelEdit,
  onStartProfileSetup,
}) => {
  console.log('DashboardContent Debug:', {
    profile: !!profile,
    isLoading,
    isEditing,
    isPreviewMode,
    profileComplete: profile?.isProfileComplete
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <ProfileEditForm 
        profile={profile}
        isLoading={isLoading}
        onSubmit={onProfileSubmit}
        onCancel={onCancelEdit}
      />
    );
  }

  // Simplified profile completion logic - show dashboard for super admins and users with profiles
  const shouldShowDashboard = isPreviewMode || profile?.isProfileComplete || profile;
  
  // Show empty state only if not in preview mode and no profile exists
  if (!shouldShowDashboard && !isPreviewMode) {
    return <EmptyProfileState onStartProfileSetup={onStartProfileSetup} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <WelcomeSection firstName={profile?.firstName} />
      
      {/* Stats Overview */}
      <DashboardStats 
        totalEarnings={totalEarnings} 
        pipelineValue={pipelineValue} 
        connectionStats={connectionStats}
      />

      {/* Two-column layout for updates and charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UpdatesSection />
        </div>
        <div className="lg:col-span-2">
          <EarningsChart earningsData={earningsData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
