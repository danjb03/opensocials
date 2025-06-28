
import React from 'react';
import { SocialMediaConnection } from '@/components/creator/SocialMediaConnection';
import AnalyticsModule from '@/components/creator/AnalyticsModule';
import { ConnectedAccountsList } from '@/components/creator/ConnectedAccountsList';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const { user } = useCreatorAuth();
  const { data: analyticsData, isLoading: analyticsLoading } = useInsightIQData(user?.id || '');

  const formatNumber = (num: number | null) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Get platform data for a specific platform
  const getPlatformData = (platform: string) => {
    return analyticsData?.find(data => data.platform === platform);
  };

  const getAnalyticsData = (platform: string) => {
    const insightIQData = getPlatformData(platform);
    
    if (insightIQData) {
      return {
        followers: formatNumber(insightIQData.follower_count),
        engagement: `${(insightIQData.engagement_rate || 0).toFixed(1)}%`,
        views: formatNumber(insightIQData.average_views),
        likes: formatNumber(insightIQData.average_likes),
        comments: formatNumber(insightIQData.average_comments),
        verified: insightIQData.is_verified || false,
        growthRate: '+0%', // Not available in current API
        contentCount: insightIQData.content_count || 0,
        credibilityScore: insightIQData.credibility_score || 0
      };
    }

    // Fallback to existing data or defaults
    const platformData = platformAnalytics[platform as keyof typeof platformAnalytics];
    return {
      followers: platformData?.followers || '0',
      engagement: platformData?.engagement || '0%',
      views: '0',
      likes: '0',
      comments: '0',
      verified: false,
      growthRate: platformData?.growth || '0%',
      contentCount: 0,
      credibilityScore: 0
    };
  };

  if (analyticsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts List */}
      <ConnectedAccountsList />
      
      {/* Show connection interface if no data */}
      {(!analyticsData || analyticsData.length === 0) && (
        <SocialMediaConnection onConnectionSuccess={() => console.log('Connection successful')} />
      )}

      {/* Platform Analytics */}
      {analyticsData && analyticsData.length > 0 && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Analytics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.map((data, index) => (
                  <div key={index} className="text-sm">
                    <strong>{data.platform}</strong>: @{data.identifier} 
                    {data.follower_count && ` - ${formatNumber(data.follower_count)} followers`}
                    {data.engagement_rate && ` - ${data.engagement_rate.toFixed(1)}% engagement`}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Individual Platform Analytics */}
          {getPlatformData('instagram') && (
            <AnalyticsModule 
              platform="Instagram" 
              metrics={getAnalyticsData('instagram')}
              isVisible={visibilitySettings.showInstagram}
            />
          )}
          
          {getPlatformData('tiktok') && (
            <AnalyticsModule 
              platform="TikTok" 
              metrics={getAnalyticsData('tiktok')}
              isVisible={visibilitySettings.showTiktok}
            />
          )}
          
          {getPlatformData('youtube') && (
            <AnalyticsModule 
              platform="YouTube" 
              metrics={getAnalyticsData('youtube')}
              isVisible={visibilitySettings.showYoutube}
            />
          )}

          {getPlatformData('linkedin') && (
            <AnalyticsModule 
              platform="LinkedIn" 
              metrics={getAnalyticsData('linkedin')}
              isVisible={visibilitySettings.showLinkedin}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SocialAnalytics;
