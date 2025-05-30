
import React from 'react';
import { SocialMediaConnection } from '@/components/creator/SocialMediaConnection';
import AnalyticsModule from '@/components/creator/AnalyticsModule';
import { useInsightIQData } from '@/hooks/useInsightIQData';

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
  const { getPlatformData } = useInsightIQData();

  const handleConnectionSuccess = () => {
    console.log('Social media connection successful - refreshing analytics');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getAnalyticsData = (platform: string) => {
    const insightIQData = getPlatformData(platform);
    
    if (insightIQData?.data) {
      return {
        followers: formatNumber(insightIQData.data.followers),
        engagement: `${insightIQData.data.engagement_rate.toFixed(1)}%`,
        views: formatNumber(insightIQData.data.avg_views),
        likes: formatNumber(insightIQData.data.avg_likes),
        verified: insightIQData.data.verified,
        growthRate: `+${insightIQData.data.growth_rate.toFixed(1)}%`
      };
    }

    // Fallback to existing data or defaults
    const platformData = platformAnalytics[platform as keyof typeof platformAnalytics];
    return {
      followers: platformData?.followers || '0',
      engagement: platformData?.engagement || '0%',
      views: '0',
      likes: '0',
      verified: false,
      growthRate: platformData?.growth || '0%'
    };
  };

  return (
    <>
      <SocialMediaConnection onConnectionSuccess={handleConnectionSuccess} />
      
      {(socialConnections.instagram || getPlatformData('instagram')?.data) && (
        <AnalyticsModule 
          platform="Instagram" 
          metrics={getAnalyticsData('instagram')}
          isVisible={visibilitySettings.showInstagram}
        />
      )}
      
      {(socialConnections.tiktok || getPlatformData('tiktok')?.data) && (
        <AnalyticsModule 
          platform="TikTok" 
          metrics={getAnalyticsData('tiktok')}
          isVisible={visibilitySettings.showTiktok}
        />
      )}
      
      {(socialConnections.youtube || getPlatformData('youtube')?.data) && (
        <AnalyticsModule 
          platform="YouTube" 
          metrics={getAnalyticsData('youtube')}
          isVisible={visibilitySettings.showYoutube}
        />
      )}

      {(socialConnections.twitter || getPlatformData('twitter')?.data) && (
        <AnalyticsModule 
          platform="Twitter" 
          metrics={getAnalyticsData('twitter')}
          isVisible={visibilitySettings.showLinkedin}
        />
      )}
    </>
  );
};

export default SocialAnalytics;
