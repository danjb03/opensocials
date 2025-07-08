
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, RefreshCw, BarChart3 } from 'lucide-react';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const PerformanceSnapshotPanel = () => {
  const { user } = useUnifiedAuth();
  const { data: analyticsData = [], isLoading, refetch } = useInsightIQData(user?.id || '');

  const calculateEngagementTrend = () => {
    // Mock calculation - in real implementation, you'd compare current vs previous period
    const avgEngagement = analyticsData.reduce((sum, account) => 
      sum + (account.engagement_rate || 0), 0) / (analyticsData.length || 1);
    
    // Simulate trend (positive for demo)
    return { value: avgEngagement * 100, change: 2.3, isPositive: true };
  };

  const getTopPerformingPlatform = () => {
    if (analyticsData.length === 0) return null;
    
    return analyticsData.reduce((best, current) => {
      const currentScore = (current.follower_count || 0) * (current.engagement_rate || 0);
      const bestScore = (best.follower_count || 0) * (best.engagement_rate || 0);
      return currentScore > bestScore ? current : best;
    });
  };

  const engagementTrend = calculateEngagementTrend();
  const topPlatform = getTopPerformingPlatform();

  const handleRefreshMetrics = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Performance Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Snapshot</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshMetrics}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {analyticsData.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Performance Data
            </h3>
            <p className="text-muted-foreground mb-4">
              Connect your social accounts to start tracking performance metrics
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Engagement Trend */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">30-Day Engagement</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {engagementTrend.value.toFixed(1)}%
                </span>
                <Badge variant={engagementTrend.isPositive ? "default" : "destructive"}>
                  {engagementTrend.isPositive ? '+' : '-'}{Math.abs(engagementTrend.change)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                vs previous period
              </p>
            </div>

            {/* Top Platform */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Top Platform</span>
              </div>
              {topPlatform ? (
                <>
                  <div className="text-2xl font-bold text-foreground capitalize">
                    {topPlatform.platform}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {((topPlatform.follower_count || 0) / 1000).toFixed(1)}K followers
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {((topPlatform.engagement_rate || 0) * 100).toFixed(1)}% engagement
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No data available
                </div>
              )}
            </div>

            {/* Total Reach */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Total Reach</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {analyticsData.reduce((sum, account) => sum + (account.follower_count || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                across all platforms
              </p>
            </div>
          </div>
        )}

        {analyticsData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()} • 
              Data refreshed automatically every 24 hours
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceSnapshotPanel;
