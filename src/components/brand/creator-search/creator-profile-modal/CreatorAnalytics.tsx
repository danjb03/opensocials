
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Eye, Heart } from 'lucide-react';
import { Creator } from '@/types/creator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreatorAnalyticsProps {
  creator: Creator;
}

export const CreatorAnalytics = ({ creator }: CreatorAnalyticsProps) => {
  // Fetch real analytics data from creator_public_analytics table
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['creator-analytics', creator.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_public_analytics')
        .select('*')
        .eq('creator_id', creator.id)
        .eq('platform', creator.platform?.toLowerCase() || 'instagram');
      
      if (error) {
        console.error('Error fetching analytics:', error);
        return null;
      }
      
      return data?.[0] || null;
    },
  });

  // Parse creator metrics for fallback data with proper type checking
  const creatorMetrics = creator.metrics as any || {};
  const followerCount = analyticsData?.follower_count || 
    (creatorMetrics?.followerCount && typeof creatorMetrics.followerCount === 'string' 
      ? parseInt(creatorMetrics.followerCount.replace(/[K,M]/g, '')) * (creatorMetrics.followerCount.includes('K') ? 1000 : creatorMetrics.followerCount.includes('M') ? 1000000 : 1)
      : creator.followers ? parseInt(creator.followers.replace(/[K,M]/g, '')) * (creator.followers.includes('K') ? 1000 : creator.followers.includes('M') ? 1000000 : 1) : 0);

  const engagementRate = analyticsData?.engagement_rate || 
    (creatorMetrics?.engagementRate && typeof creatorMetrics.engagementRate === 'string'
      ? parseFloat(creatorMetrics.engagementRate.replace('%', ''))
      : creator.engagement ? parseFloat(creator.engagement.replace('%', '')) : 0);

  const avgViews = analyticsData?.average_views || 0;
  const avgLikes = analyticsData?.average_likes || 0;
  const avgComments = analyticsData?.average_comments || 0;
  const contentCount = analyticsData?.content_count || 0;
  const credibilityScore = analyticsData?.credibility_score || 0;

  // Calculate reach rate based on engagement and followers
  const reachRate = followerCount > 0 ? Math.min(((avgViews || 0) / followerCount) * 100, 100) : 0;
  
  // Calculate growth rate (not available in current API, so we'll show as unavailable)
  const growthRate = null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if no analytics data available
  if (!analyticsData && !creator.followers && !creatorMetrics?.followerCount) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analytics Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Detailed analytics are not available for this creator yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Analytics data will be populated once the creator connects their social media accounts through our InsightIQ integration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">
                {avgViews > 0 ? formatNumber(avgViews) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Views</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">
                {avgLikes > 0 ? formatNumber(avgLikes) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Likes</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                {reachRate > 0 ? `${reachRate.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Reach Rate</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">
                {growthRate ? `+${growthRate}%` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Engagement Quality</span>
                <span className="text-sm font-semibold">
                  {engagementRate > 0 ? `${engagementRate.toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <Progress value={engagementRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Content Authenticity</span>
                <span className="text-sm font-semibold">
                  {credibilityScore > 0 ? `${Math.round(credibilityScore)}%` : 'N/A'}
                </span>
              </div>
              <Progress value={credibilityScore > 0 ? credibilityScore : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Profile Verification</span>
                <span className="text-sm font-semibold">
                  {analyticsData?.is_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <Progress value={analyticsData?.is_verified ? 100 : 0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Content</span>
                <Badge variant="outline">
                  {contentCount > 0 ? formatNumber(contentCount) : 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Platform</span>
                <Badge variant="outline">{creator.platform || 'N/A'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Account Type</span>
                <Badge variant="outline">
                  {analyticsData?.platform_account_type || 'Standard'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Avg Comments</span>
                <Badge variant="outline">
                  {avgComments > 0 ? formatNumber(avgComments) : 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Followers</span>
                <Badge variant="outline">
                  {followerCount > 0 ? formatNumber(followerCount) : 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Verification Status</span>
                <Badge variant="outline">
                  {analyticsData?.is_verified ? '✓ Verified' : 'Not Verified'}
                </Badge>
              </div>
            </div>
          </div>
          
          {!analyticsData && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Limited analytics data available. Connect with this creator to access their full InsightIQ analytics dashboard with detailed performance metrics, audience demographics, and content insights.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
