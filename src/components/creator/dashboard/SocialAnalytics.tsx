import React from 'react';
import { SocialMediaConnection } from '@/components/creator/SocialMediaConnection';
import AnalyticsModule from '@/components/creator/AnalyticsModule';
import { ConnectedAccountsList } from '@/components/creator/ConnectedAccountsList';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, Heart, MessageCircle, User } from 'lucide-react';

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
  const { user } = useUnifiedAuth();
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
        credibilityScore: insightIQData.credibility_score || 0,
        profileImage: insightIQData.image_url,
        fullName: insightIQData.full_name,
        bio: insightIQData.introduction,
        profileUrl: insightIQData.profile_url
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
      credibilityScore: 0,
      profileImage: null,
      fullName: null,
      bio: null,
      profileUrl: null
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
          {/* Enhanced Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Enhanced Analytics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.map((data, index) => {
                  const analytics = getAnalyticsData(data.platform);
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={analytics.profileImage || ''} alt={analytics.fullName || data.identifier} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {data.platform.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium capitalize">{data.platform}</h3>
                          {analytics.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">@{data.identifier}</p>
                        {analytics.fullName && (
                          <p className="text-sm font-medium">{analytics.fullName}</p>
                        )}
                        {analytics.bio && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{analytics.bio}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{analytics.followers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{analytics.engagement}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{analytics.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{analytics.contentCount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
