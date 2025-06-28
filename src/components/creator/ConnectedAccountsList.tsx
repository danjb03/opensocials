
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Youtube, Twitter, Linkedin, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
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
      data.platform === platform && data.identifier === handle
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Connected Accounts ({connectedAccounts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {connectedAccounts.map((account) => {
            const PlatformIcon = PLATFORM_ICONS[account.platform as keyof typeof PLATFORM_ICONS];
            const platformColor = PLATFORM_COLORS[account.platform as keyof typeof PLATFORM_COLORS];
            const analytics = getAnalyticsForAccount(account.platform, account.handle);
            
            return (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${platformColor}`}>
                    {PlatformIcon && <PlatformIcon className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{account.platform}</span>
                      <span className="text-muted-foreground">@{account.handle}</span>
                    </div>
                    {analytics && (
                      <div className="text-sm text-muted-foreground">
                        {analytics.follower_count?.toLocaleString()} followers • {analytics.engagement_rate?.toFixed(1)}% engagement
                      </div>
                    )}
                    {account.error_message && (
                      <div className="text-sm text-red-600 mt-1">
                        Error: {account.error_message}
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
            );
          })}
        </div>
        
        {analyticsLoading && (
          <div className="text-center py-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
            Loading analytics data...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
