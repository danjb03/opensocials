import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Platform icons
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconMap = {
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };

  return iconMap[platform] || null;
};

// Format numbers for display
const formatNumber = (num: number): string => {
  if (!num && num !== 0) return "N/A";
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

// Format percentages
const formatPercent = (num: number): string => {
  if (!num && num !== 0) return "N/A";
  return num.toFixed(1) + "%";
};

// Calculate growth rate
const calculateGrowth = (current: number, previous: number): string => {
  if (!current || !previous) return "N/A";
  
  const growth = ((current - previous) / previous) * 100;
  const prefix = growth >= 0 ? "+" : "";
  return `${prefix}${growth.toFixed(1)}%`;
};

export interface SocialMetricsCardsProps {
  creatorId?: string; // Optional: if provided, shows metrics for this creator (admin use)
  onRefresh?: () => void; // Optional callback for when metrics are refreshed
}

export function SocialMetricsCards({ creatorId, onRefresh }: SocialMetricsCardsProps) {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch metrics data
  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get authenticated user if no creatorId provided
      let targetCreatorId = creatorId;
      
      if (!targetCreatorId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetCreatorId = user?.id;
        
        if (!targetCreatorId) {
          throw new Error("User not authenticated");
        }
      }
      
      // Fetch metrics from the view
      const { data, error } = await supabase
        .from("v_creator_social_overview")
        .select("*")
        .eq("creator_id", targetCreatorId)
        .order("platform", { ascending: true });
      
      if (error) throw error;
      
      setMetrics(data || []);
    } catch (err) {
      console.error("Error fetching social metrics:", err);
      setError(err.message || "Failed to load social metrics");
      toast({
        title: "Error",
        description: "Failed to load social metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch metrics on component mount
  useEffect(() => {
    fetchMetrics();
  }, [creatorId]);

  // Refresh metrics
  const refreshMetrics = async (accountId: string, platform: string) => {
    try {
      toast({
        title: "Refreshing Data",
        description: `Refreshing ${platform} metrics...`,
      });
      
      // Call connect-social-account function to trigger a new Apify run
      const { data, error } = await supabase.functions.invoke("connect-social-account", {
        body: {
          refresh: true,
          account_id: accountId,
        },
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "Failed to refresh metrics");
      }
      
      toast({
        title: "Refresh Started",
        description: `${platform} metrics refresh has been started. This may take a minute.`,
      });
      
      // Call onRefresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Error refreshing metrics:", err);
      toast({
        title: "Refresh Failed",
        description: err.message || "Failed to refresh metrics",
        variant: "destructive",
      });
    }
  };

  // Render loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle>Error Loading Metrics</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={fetchMetrics}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  // Render empty state
  if (metrics.length === 0) {
    return (
      <Card className="text-center p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-gray-100 p-3">
            <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">No Social Accounts Connected</h3>
            <p className="text-sm text-gray-500">
              Connect your social media accounts to see analytics and metrics here.
            </p>
          </div>
          <Button onClick={() => window.location.href = "/creator/profile"}>
            Connect Accounts
          </Button>
        </div>
      </Card>
    );
  }

  // Render metrics cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.platform} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`rounded-full p-1.5 ${
                  metric.platform === "instagram" ? "bg-pink-100 text-pink-600" :
                  metric.platform === "tiktok" ? "bg-black text-white" :
                  metric.platform === "youtube" ? "bg-red-100 text-red-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  <PlatformIcon platform={metric.platform} />
                </div>
                <CardTitle className="text-lg capitalize">
                  {metric.platform}
                  {metric.is_verified && (
                    <span className="ml-1 inline-flex items-center">
                      <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </span>
                  )}
                </CardTitle>
              </div>
              {metric.status === "running" && (
                <Badge variant="outline" className="animate-pulse">
                  Updating...
                </Badge>
              )}
            </div>
            <CardDescription>@{metric.handle}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Main follower count */}
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">
                  {formatNumber(metric.followers)}
                </h3>
                <div className="text-sm">
                  {metric.followers_prev && (
                    <span className={`font-medium ${
                      metric.followers > metric.followers_prev ? "text-green-600" : 
                      metric.followers < metric.followers_prev ? "text-red-600" : 
                      "text-gray-600"
                    }`}>
                      {calculateGrowth(metric.followers, metric.followers_prev)}
                    </span>
                  )}
                  <span className="text-gray-500 ml-1">30d</span>
                </div>
              </div>
              
              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Engagement Rate */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Engagement</div>
                  <div className="text-lg font-semibold">
                    {formatPercent(metric.engagement_rate)}
                  </div>
                </div>
                
                {/* Average Views */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Avg. Views</div>
                  <div className="text-lg font-semibold">
                    {formatNumber(metric.views_avg)}
                  </div>
                </div>
                
                {/* Posts in last 30 days */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Posts (30d)</div>
                  <div className="text-lg font-semibold">
                    {metric.posts_30d || "N/A"}
                  </div>
                </div>
                
                {/* Last Post */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Last Post</div>
                  <div className="text-lg font-semibold">
                    {metric.last_post_date ? (
                      formatDistanceToNow(new Date(metric.last_post_date), { addSuffix: true })
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>
              
              {/* Last updated */}
              <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                <div>
                  Updated {metric.snapshot_ts ? formatDistanceToNow(new Date(metric.snapshot_ts), { addSuffix: true }) : "never"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={metric.status === "running"}
                  onClick={() => refreshMetrics(metric.account_id, metric.platform)}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
