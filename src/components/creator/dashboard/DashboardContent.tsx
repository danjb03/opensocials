
import React from 'react';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import EmptyProfileState from '@/components/creator/EmptyProfileState';
import AudienceLocation from '@/components/creator/AudienceLocation';
import DashboardStats from './DashboardStats';
import SocialAnalytics from './SocialAnalytics';
import EarningsChart from './EarningsChart';
import { CreatorProfile } from '@/hooks/useCreatorProfile'; // Use the interface from the hook

interface DashboardContentProps {
  profile: any;
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
  platformAnalytics,
  onProfileSubmit,
  onCancelEdit,
  onStartProfileSetup,
  onAvatarChange,
  onConnectPlatform
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

  if (!profile?.isProfileComplete && !isPreviewMode) {
    return <EmptyProfileState onStartProfileSetup={onStartProfileSetup} />;
  }

  return (
    <div className="space-y-6">
      <DashboardStats 
        totalEarnings={totalEarnings} 
        pipelineValue={pipelineValue} 
        connectionStats={connectionStats}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SocialAnalytics 
            socialConnections={profile?.socialConnections || {
              instagram: false,
              tiktok: false,
              youtube: false,
              linkedin: false
            }}
            platformAnalytics={platformAnalytics}
            visibilitySettings={profile?.visibilitySettings || {
              showInstagram: true,
              showTiktok: true,
              showYoutube: true,
              showLinkedin: true,
              showLocation: true,
              showAnalytics: true
            }}
            onConnect={onConnectPlatform}
            isLoading={isLoading}
          />
          
          {profile?.audienceLocation && (
            <AudienceLocation 
              audienceLocation={profile.audienceLocation}
              isVisible={profile.visibilitySettings?.showLocation || true}
            />
          )}
          
          <EarningsChart earningsData={earningsData} />
        </div>
        
        <div className="space-y-6">
          {/* Visibility controls will be rendered by parent component */}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
