
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Youtube, Twitter, Linkedin, CheckCircle, Clock, AlertCircle, Loader2, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { useConnectedAccounts } from '@/hooks/creator/useConnectedAccounts';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const PLATFORM_ICONS = {
  instagram: Instagram,
  tiktok: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

const PLATFORM_COLORS = {
  instagram: 'bg-pink-500',
  tiktok: 'bg-black',
  youtube: 'bg-red-500',
  linkedin: 'bg-blue-500',
};

export const ConnectedAccountsList: React.FC = () => {
  const { user } = useUnifiedAuth();
  const { data: connectedAccounts, isLoading: accountsLoading } = useConnectedAccounts();
  const { data: analyticsData, isLoading: analyticsLoading } = useInsightIQData(user?.id || '');

  if (accountsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Connected Accounts...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!connectedAccounts || connectedAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No social media accounts connected yet. Connect an account above to see your analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getAnalyticsForAccount = (platform: string, handle: string) => {
    return analyticsData?.find(data => 
      data.platform === platform && (data.identifier === handle || data.identifier.includes(handle))
    );
  };

  const formatNumber = (num: number | null) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Connected Accounts ({connectedAccounts.length})
        </CardTitle>
        {analyticsLoading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading analytics data...
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connectedAccounts.map((account) => {
            const PlatformIcon = PLATFORM_ICONS[account.platform as keyof typeof PLATFORM_ICONS];
            const platformColor = PLATFORM_COLORS[account.platform as keyof typeof PLATFORM_COLORS];
            const analytics = getAnalyticsForAccount(account.platform, account.handle);
            
            return (
              <div key={account.id} className="border rounded-lg p-4 space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg text-white ${platformColor}`}>
                      {PlatformIcon && <PlatformIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{account.platform}</span>
                        <span className="text-muted-foreground">@{account.handle}</span>
                      </div>
                      {account.last_run && (
                        <div className="text-xs text-muted-foreground">
                          Last updated: {new Date(account.last_run).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(account.status)}
                    <Badge variant="outline" className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                </div>

                {/* Analytics Row */}
                {analytics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{formatNumber(analytics.follower_count)}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{analytics.engagement_rate?.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{formatNumber(analytics.average_views)}</div>
                        <div className="text-xs text-muted-foreground">Avg Views</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{formatNumber(analytics.content_count)}</div>
                        <div className="text-xs text-muted-foreground">Posts</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {account.error_message && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    <strong>Error:</strong> {account.error_message}
                  </div>
                )}

                {/* No Analytics Message */}
                {!analytics && account.status === 'ready' && (
                  <div className="text-sm text-muted-foreground bg-yellow-50 p-2 rounded">
                    No analytics data available yet. Try processing results or triggering a new scrape.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
