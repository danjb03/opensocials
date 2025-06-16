
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Users, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
import { useInsightIQData } from '@/hooks/useInsightIQData';

interface CreatorAnalyticsCardProps {
  creator_id: string;
}

const PLATFORM_CONFIG = {
  instagram: { name: 'Instagram', emoji: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  tiktok: { name: 'TikTok', emoji: '🎵', color: 'bg-black' },
  youtube: { name: 'YouTube', emoji: '▶️', color: 'bg-red-600' },
  twitter: { name: 'Twitter/X', emoji: '🐦', color: 'bg-blue-500' },
  twitch: { name: 'Twitch', emoji: '🎮', color: 'bg-purple-600' },
  facebook: { name: 'Facebook', emoji: '📘', color: 'bg-blue-700' },
  linkedin: { name: 'LinkedIn', emoji: '💼', color: 'bg-blue-600' },
};

const formatNumber = (num: number | null): string => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const CreatorAnalyticsCard: React.FC<CreatorAnalyticsCardProps> = ({ creator_id }) => {
  const { data, isLoading, error } = useInsightIQData(creator_id);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No profile data available yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Connect social profiles to display analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((analytics) => {
        const platformConfig = PLATFORM_CONFIG[analytics.platform as keyof typeof PLATFORM_CONFIG];
        const isLinkedIn = analytics.platform === 'linkedin';

        return (
          <Card key={analytics.id} className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${platformConfig?.color || 'bg-gray-500'}`}>
                    <span className="text-lg">{platformConfig?.emoji || '📱'}</span>
                  </div>
                  <div>
                    <span className="font-semibold">{platformConfig?.name || analytics.platform}</span>
                    {analytics.is_verified && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                {analytics.profile_url && (
                  <a
                    href={analytics.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Profile Info */}
              <div className="flex items-center space-x-4">
                {analytics.image_url && (
                  <img
                    src={analytics.image_url}
                    alt={analytics.full_name || 'Profile'}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                )}
                <div>
                  {analytics.full_name && (
                    <h3 className="font-semibold text-lg">{analytics.full_name}</h3>
                  )}
                  <p className="text-muted-foreground">@{analytics.identifier}</p>
                  {analytics.introduction && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {analytics.introduction}
                    </p>
                  )}
                </div>
              </div>

              {isLinkedIn ? (
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    📄 Manually added LinkedIn profile
                  </p>
                </div>
              ) : (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Followers</span>
                      </div>
                      <p className="text-xl font-bold">{formatNumber(analytics.follower_count)}</p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Engagement</span>
                      </div>
                      <p className="text-xl font-bold">
                        {analytics.engagement_rate ? `${analytics.engagement_rate.toFixed(1)}%` : '0%'}
                      </p>
                    </div>
                  </div>

                  {/* Content Performance */}
                  {(analytics.average_views || analytics.average_likes || analytics.average_comments) && (
                    <div className="grid grid-cols-3 gap-2">
                      {analytics.average_views && (
                        <div className="text-center p-2 bg-muted rounded">
                          <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Avg Views</p>
                          <p className="font-semibold text-sm">{formatNumber(analytics.average_views)}</p>
                        </div>
                      )}
                      {analytics.average_likes && (
                        <div className="text-center p-2 bg-muted rounded">
                          <Heart className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Avg Likes</p>
                          <p className="font-semibold text-sm">{formatNumber(analytics.average_likes)}</p>
                        </div>
                      )}
                      {analytics.average_comments && (
                        <div className="text-center p-2 bg-muted rounded">
                          <MessageCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Avg Comments</p>
                          <p className="font-semibold text-sm">{formatNumber(analytics.average_comments)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Top Content Preview */}
                  {analytics.top_contents && Array.isArray(analytics.top_contents) && analytics.top_contents.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Top Content</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {analytics.top_contents.slice(0, 3).map((content: any, index: number) => (
                          <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                            {content.thumbnail_url ? (
                              <img
                                src={content.thumbnail_url}
                                alt={`Content ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-2xl">{platformConfig?.emoji || '📱'}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Last Updated */}
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Last updated: {new Date(analytics.fetched_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
