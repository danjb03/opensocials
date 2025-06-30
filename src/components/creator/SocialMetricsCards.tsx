import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon'; // Assuming a TikTokIcon component exists
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Helper Functions ---

/**
 * Formats large numbers into a more readable format (e.g., 1.2K, 3.4M).
 * @param num The number to format.
 * @returns A formatted string.
 */
const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Renders the appropriate icon for each social media platform.
 * @param platform The name of the platform.
 * @returns A JSX element representing the icon.
 */
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconProps = { className: "w-5 h-5" };
  switch (platform) {
    case 'instagram': return <Instagram {...iconProps} />;
    case 'tiktok': return <TikTokIcon {...iconProps} />;
    case 'youtube': return <Youtube {...iconProps} />;
    case 'linkedin': return <Linkedin {...iconProps} />;
    case 'twitter': return <Twitter {...iconProps} />;
    default: return null;
  }
};

// --- Main Component ---

export interface SocialMetricsCardsProps {
  creatorId: string;
}

export const SocialMetricsCards: React.FC<SocialMetricsCardsProps> = ({ creatorId }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('v_creator_social_overview')
        .select('*')
        .eq('creator_id', creatorId)
        .order('platform', { ascending: true });

      if (fetchError) throw fetchError;
      setMetrics(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load social metrics.');
      toast.error('Error fetching social metrics.');
    } finally {
      setIsLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleRefresh = async (platform: string, handle: string) => {
    setRefreshing(prev => ({ ...prev, [platform]: true }));
    try {
      const { data, error: functionError } = await supabase.functions.invoke('connect-social-account', {
        body: { platform, handle, creator_id: creatorId },
      });

      if (functionError) throw functionError;
      if (!data?.success) throw new Error(data?.error || 'Failed to start refresh.');
      
      toast.info(`Refreshing ${platform} data... This may take a few minutes.`);
      // Optionally, poll for status updates or rely on real-time subscriptions
      setTimeout(fetchMetrics, 60000); // Re-fetch after 1 minute
    } catch (err: any) {
      toast.error(`Failed to refresh ${platform}: ${err.message}`);
    } finally {
      setRefreshing(prev => ({ ...prev, [platform]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-16" /></div>
              <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-16" /></div>
              <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-16" /></div>
              <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-16" /></div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive p-4 bg-destructive/10 rounded-md">{error}</div>;
  }

  if (metrics.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
        <h3 className="text-lg font-medium">No Social Accounts Connected</h3>
        <p className="text-muted-foreground mt-2">Connect your accounts to see your metrics.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.platform} className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={metric.profile_picture_url} alt={metric.username} />
                    <AvatarFallback>{metric.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <PlatformIcon platform={metric.platform} />
                      <span className="ml-2 capitalize">{metric.platform}</span>
                    </CardTitle>
                    <CardDescription>@{metric.username}</CardDescription>
                  </div>
                </div>
                {metric.is_verified && <Badge variant="secondary">Verified</Badge>}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Followers</p>
                <p className="text-xl font-bold">{formatNumber(metric.followers_count)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Engagement</p>
                <p className="text-xl font-bold">{metric.engagement_rate?.toFixed(2) ?? 'N/A'}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Avg. Likes</p>
                <p className="font-semibold">{formatNumber(metric.avg_likes)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Avg. Comments</p>
                <p className="font-semibold">{formatNumber(metric.avg_comments)}</p>
              </div>
              {metric.avg_views && (
                 <div className="space-y-1">
                  <p className="text-muted-foreground">Avg. Views</p>
                  <p className="font-semibold">{formatNumber(metric.avg_views)}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
              <p>
                Updated {metric.metric_last_updated ? formatDistanceToNow(new Date(metric.metric_last_updated), { addSuffix: true }) : 'never'}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRefresh(metric.platform, metric.handle)}
                    disabled={refreshing[metric.platform]}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing[metric.platform] ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Data</p>
                </TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};
