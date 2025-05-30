
import React from 'react';
import { SocialMediaConnection } from '@/components/creator/SocialMediaConnection';
import AnalyticsModule from '@/components/creator/AnalyticsModule';

interface SocialAnalyticsProps {
  socialConnections: {
    instagram?: boolean;
    tiktok?: boolean;
    youtube?: boolean;
    linkedin?: boolean;
  };
  platformAnalytics: {
    instagram?: { followers: string; engagement: string; growth: string };
    tiktok?: { followers: string; engagement: string; growth: string };
    youtube?: { followers: string; engagement: string; growth: string };
  };
  visibilitySettings: {
    showInstagram: boolean;
    showTiktok: boolean;
    showYoutube: boolean;
    showLinkedin: boolean;
    showLocation: boolean;
    showAnalytics: boolean;
  };
  onConnect: (platform: string) => void;
  isLoading: boolean;
}

const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({
  socialConnections,
  platformAnalytics,
  visibilitySettings,
  onConnect,
  isLoading
}) => {
  const handleConnectionSuccess = () => {
    // Refresh the analytics data
    Object.keys(socialConnections).forEach(platform => {
      if (socialConnections[platform as keyof typeof socialConnections]) {
        onConnect(platform);
      }
    });
  };

  return (
    <>
      <SocialMediaConnection onConnectionSuccess={handleConnectionSuccess} />
      
      {socialConnections.instagram && (
        <AnalyticsModule 
          platform="Instagram" 
          metrics={{
            followers: platformAnalytics.instagram?.followers || '15.2K',
            engagement: platformAnalytics.instagram?.engagement || '3.2%',
            views: '5,600 avg',
            likes: '1,200 avg',
            verified: true,
            growthRate: platformAnalytics.instagram?.growth || '+2.5%'
          }}
          isVisible={visibilitySettings.showInstagram}
        />
      )}
      
      {socialConnections.tiktok && (
        <AnalyticsModule 
          platform="TikTok" 
          metrics={{
            followers: platformAnalytics.tiktok?.followers || '22.4K',
            engagement: platformAnalytics.tiktok?.engagement || '5.7%',
            views: '8,900 avg',
            likes: '2,100 avg',
            verified: false,
            growthRate: platformAnalytics.tiktok?.growth || '+4.1%'
          }}
          isVisible={visibilitySettings.showTiktok}
        />
      )}
      
      {socialConnections.youtube && (
        <AnalyticsModule 
          platform="YouTube" 
          metrics={{
            followers: platformAnalytics.youtube?.followers || '8.7K',
            engagement: platformAnalytics.youtube?.engagement || '2.8%',
            views: '3,200 avg',
            likes: '780 avg',
            verified: true,
            growthRate: platformAnalytics.youtube?.growth || '+1.2%'
          }}
          isVisible={visibilitySettings.showYoutube}
        />
      )}
    </>
  );
};

export default SocialAnalytics;
