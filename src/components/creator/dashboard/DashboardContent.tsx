
import React from 'react';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import EmptyProfileState from '@/components/creator/EmptyProfileState';
import DashboardStats from './DashboardStats';
import EarningsChart from './EarningsChart';
import WelcomeSection from './WelcomeSection';
import UpdatesSection from './UpdatesSection';
import { CreatorAnalyticsProfile } from '@/components/creator/analytics/CreatorAnalyticsProfile';
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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your profile...</p>
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

  // Check if profile is complete - this should now work correctly
  const isProfileComplete = profile?.isProfileComplete || false;
  
  // Show empty state only if profile is not complete AND not in preview mode
  if (!isProfileComplete && !isPreviewMode) {
    return <EmptyProfileState onStartProfileSetup={onStartProfileSetup} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <WelcomeSection firstName={profile?.firstName || profile?.first_name} />
      
      {/* Social Media Analytics - Only show if profile exists */}
      {profile && <CreatorAnalyticsProfile />}
      
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
