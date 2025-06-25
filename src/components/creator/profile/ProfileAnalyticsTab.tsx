
import React from 'react';
import SocialAnalytics from '@/components/creator/dashboard/SocialAnalytics';

interface VisibilitySettings {
  showInstagram: boolean;
  showTiktok: boolean;
  showYoutube: boolean;
  showLinkedin: boolean;
  showLocation: boolean;
  showAnalytics: boolean;
}

interface ProfileAnalyticsTabProps {
  visibilitySettings: VisibilitySettings;
}

const ProfileAnalyticsTab: React.FC<ProfileAnalyticsTabProps> = ({ visibilitySettings }) => {
  return (
    <SocialAnalytics
      socialConnections={{
        instagram: true,
        tiktok: true,
        youtube: true,
        linkedin: true
      }}
      platformAnalytics={{
        instagram: { followers: '0', engagement: '0%', growth: '0%' },
        tiktok: { followers: '0', engagement: '0%', growth: '0%' },
        youtube: { followers: '0', engagement: '0%', growth: '0%' }
      }}
      visibilitySettings={visibilitySettings}
      onConnect={() => {}}
      isLoading={false}
    />
  );
};

export default ProfileAnalyticsTab;
