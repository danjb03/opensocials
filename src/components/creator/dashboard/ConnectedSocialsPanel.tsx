
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertTriangle, RefreshCw, Instagram, Youtube } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/SocialIcons';
import { useConnectedAccounts } from '@/hooks/creator/useConnectedAccounts';
import { useSocialMetricsRefresh } from '@/hooks/creator/useSocialMetricsRefresh';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import SocialConnectionModal from './SocialConnectionModal';

const ConnectedSocialsPanel = () => {
  const { user } = useUnifiedAuth();
  const { data: connectedAccounts = [], isLoading } = useConnectedAccounts();
  const { data: analyticsData = [] } = useInsightIQData(user?.id || '');
  const refreshMetrics = useSocialMetricsRefresh();
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'tiktok':
        return <TikTokIcon className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <div className="h-5 w-5 rounded bg-muted" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatEngagementRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const isDataStale = (lastRun: string | null) => {
    if (!lastRun) return true;
    const lastRunDate = new Date(lastRun);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastRunDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 48;
  };

  const getStatusBadge = (status: string, lastRun: string | null) => {
    if (status === 'running') {
      return <Badge variant="secondary">Syncing...</Badge>;
    }
    if (status === 'failed' || isDataStale(lastRun)) {
      return <Badge variant="destructive">Needs Update</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const handleRefreshMetrics = async (platform: string, username: string) => {
    await refreshMetrics.mutateAsync({ platform, username });
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Connected Social Accounts</CardTitle>
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
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Connected Social Accounts</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConnectionModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Connect Account</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {connectedAccounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Connected Accounts
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect your social media accounts to track performance and grow your audience
              </p>
              <Button onClick={() => setIsConnectionModalOpen(true)}>
                Connect Your First Account
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedAccounts.map((account) => {
                const analytics = analyticsData.find(a => a.platform === account.platform);
                const isStale = isDataStale(account.last_run);
                const isRefreshing = refreshMetrics.isPending;
                
                return (
                  <div
                    key={account.id}
                    className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center">
                          {getPlatformIcon(account.platform)}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground capitalize">
                            {account.platform}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            @{account.handle}
                          </p>
                        </div>
                      </div>
                      {isStale && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Followers</span>
                        <span className="font-medium text-foreground">
                          {analytics?.follower_count ? formatNumber(analytics.follower_count) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="font-medium text-foreground">
                          {analytics?.engagement_rate ? formatEngagementRate(analytics.engagement_rate) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      {getStatusBadge(account.status, account.last_run)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleRefreshMetrics(account.platform, account.handle)}
                        disabled={isRefreshing}
                      >
                        {isRefreshing ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          'Refresh'
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <SocialConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
      />
    </>
  );
};

export default ConnectedSocialsPanel;
