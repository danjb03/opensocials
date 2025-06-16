
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Globe,
  Camera,
  Play,
  CheckCircle,
  BarChart3
} from 'lucide-react';

const PLATFORM_CONFIG = {
  instagram: { name: 'Instagram', icon: Camera, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  tiktok: { name: 'TikTok', icon: Play, color: 'bg-black' },
  youtube: { name: 'YouTube', icon: Play, color: 'bg-red-600' },
  twitter: { name: 'Twitter/X', icon: MessageCircle, color: 'bg-blue-500' },
  twitch: { name: 'Twitch', icon: Play, color: 'bg-purple-600' },
  facebook: { name: 'Facebook', icon: Users, color: 'bg-blue-700' },
  linkedin: { name: 'LinkedIn', icon: Users, color: 'bg-blue-600' },
};

const formatNumber = (num: number | null): string => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatPercentage = (num: number | null): string => {
  if (!num) return '0%';
  return `${num.toFixed(1)}%`;
};

export const CreatorAnalyticsProfile: React.FC = () => {
  const { user } = useCreatorAuth();
  const { data: analyticsData, isLoading, error } = useInsightIQData(user?.id || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData || analyticsData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No analytics data available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Connect your social profiles to display comprehensive analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get primary platform (first one with most followers)
  const primaryPlatform = analyticsData.reduce((prev, current) => 
    (current.follower_count || 0) > (prev.follower_count || 0) ? current : prev
  );

  // Calculate total metrics across all platforms
  const totalFollowers = analyticsData.reduce((sum, data) => sum + (data.follower_count || 0), 0);
  const avgEngagement = analyticsData.reduce((sum, data) => sum + (data.engagement_rate || 0), 0) / analyticsData.length;
  const totalContent = analyticsData.reduce((sum, data) => sum + (data.content_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className={`h-32 ${PLATFORM_CONFIG[primaryPlatform.platform as keyof typeof PLATFORM_CONFIG]?.color || 'bg-gradient-to-r from-blue-500 to-purple-600'}`} />
        <CardContent className="p-6 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={primaryPlatform.image_url || ''} />
              <AvatarFallback className="text-2xl">
                {primaryPlatform.full_name?.split(' ').map(n => n[0]).join('') || 'CR'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">
                  {primaryPlatform.full_name || `@${primaryPlatform.identifier}`}
                </h1>
                {primaryPlatform.is_verified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
              
              <p className="text-muted-foreground mb-4 max-w-2xl">
                {primaryPlatform.introduction || 'Creative professional and content creator'}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold">{formatNumber(totalFollowers)}</div>
                  <div className="text-sm text-muted-foreground">Total Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatPercentage(avgEngagement)}</div>
                  <div className="text-sm text-muted-foreground">Avg Engagement</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalContent}</div>
                  <div className="text-sm text-muted-foreground">Total Content</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{analyticsData.length}</div>
                  <div className="text-sm text-muted-foreground">Platforms</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsData.map((platform, index) => {
          const config = PLATFORM_CONFIG[platform.platform as keyof typeof PLATFORM_CONFIG];
          const Icon = config?.icon || Users;
          
          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg text-white ${config?.color || 'bg-gray-500'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config?.name || platform.platform}</CardTitle>
                      <p className="text-sm text-muted-foreground">@{platform.identifier}</p>
                    </div>
                  </div>
                  {platform.is_verified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold">{formatNumber(platform.follower_count)}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold">{formatPercentage(platform.engagement_rate)}</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                </div>
                
                {platform.average_views && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-semibold">{formatNumber(platform.average_views)}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <Heart className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-semibold">{formatNumber(platform.average_likes)}</div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <MessageCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-semibold">{formatNumber(platform.average_comments)}</div>
                      <div className="text-xs text-muted-foreground">Comments</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Audience Demographics */}
      {primaryPlatform.audience && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution */}
          {primaryPlatform.audience.gender_distribution && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gender Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(primaryPlatform.audience.gender_distribution).map(([gender, percentage]) => (
                    <div key={gender} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{gender}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <Progress value={percentage as number} className="flex-1" />
                        <span className="text-sm font-semibold w-12">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Age Distribution */}
          {primaryPlatform.audience.age_distribution && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Age Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(primaryPlatform.audience.age_distribution).map(([age, percentage]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="font-medium">{age}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <Progress value={percentage as number} className="flex-1" />
                        <span className="text-sm font-semibold w-12">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Geographic Distribution */}
      {primaryPlatform.audience?.geographic_distribution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Audience Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(primaryPlatform.audience.geographic_distribution)
                .slice(0, 10)
                .map(([location, percentage]) => (
                <div key={location} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{location}</span>
                  <Badge variant="secondary">{percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brand Affinity */}
      {primaryPlatform.brand_affinity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Brand Affinity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(primaryPlatform.brand_affinity)
                .slice(0, 9)
                .map(([brand, score]) => (
                <div key={brand} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{brand}</span>
                  <Badge variant="outline">{typeof score === 'number' ? score.toFixed(1) : score}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Interests */}
      {primaryPlatform.top_interests && (
        <Card>
          <CardHeader>
            <CardTitle>Audience Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {primaryPlatform.top_interests.slice(0, 15).map((interest: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {primaryPlatform.credibility_score ? (primaryPlatform.credibility_score * 10).toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Credibility Score</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(primaryPlatform.content_count)}
              </div>
              <div className="text-sm text-muted-foreground">Total Content</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {primaryPlatform.sponsored_posts_performance ? 
                  formatPercentage(primaryPlatform.sponsored_posts_performance) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Sponsored Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
