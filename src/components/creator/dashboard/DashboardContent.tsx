
import React from 'react';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import EmptyProfileState from '@/components/creator/EmptyProfileState';
import DashboardStats from './DashboardStats';
import EarningsChart from './EarningsChart';
import { CreatorAnalyticsProfile } from '@/components/creator/CreatorAnalyticsProfile';
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
      <DashboardStats 
        totalEarnings={totalEarnings} 
        pipelineValue={pipelineValue} 
        connectionStats={connectionStats}
      />

      {/* Comprehensive Creator Analytics Profile */}
      <CreatorAnalyticsProfile />
      
      <EarningsChart earningsData={earningsData} />
    </div>
  );
};

export default DashboardContent;
