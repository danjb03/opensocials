
// Utility functions for fetching metrics from external APIs like Modash

interface ExternalMetrics {
  followerCount: number;
  engagementRate: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  reachRate: number;
  impressions: number;
  growthRate: number;
  lastUpdated: string;
}

interface ModashCreatorData {
  // Define Modash API response structure here
  // This will need to be updated based on actual Modash API documentation
  id: string;
  username: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  avg_views: number;
  // Add other Modash fields as needed
}

/**
 * Fetch creator metrics from Modash API
 * This is a placeholder implementation - replace with actual Modash API integration
 */
export async function fetchModashMetrics(
  creatorUsername: string, 
  platform: string
): Promise<ExternalMetrics | null> {
  try {
    // TODO: Replace with actual Modash API endpoint and authentication
    const apiKey = process.env.MODASH_API_KEY; // This would be stored in Supabase secrets
    
    if (!apiKey) {
      console.warn('Modash API key not configured');
      return null;
    }

    const response = await fetch(`https://api.modash.io/v1/creators/${platform}/${creatorUsername}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Modash API error: ${response.status}`);
    }

    const data: ModashCreatorData = await response.json();

    return {
      followerCount: data.followers,
      engagementRate: data.engagement_rate,
      avgViews: data.avg_views || 0,
      avgLikes: data.avg_likes,
      avgComments: data.avg_comments,
      reachRate: 0, // Calculate or get from API
      impressions: 0, // Calculate or get from API
      growthRate: 0, // Calculate or get from API
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Modash metrics:', error);
    return null;
  }
}

/**
 * Fetch metrics from alternative API providers
 * Add other API integrations here (HypeAuditor, Social Blade, etc.)
 */
export async function fetchAlternativeMetrics(
  creatorId: string,
  platform: string
): Promise<ExternalMetrics | null> {
  // TODO: Implement alternative API integrations
  console.log(`Fetching alternative metrics for ${creatorId} on ${platform}`);
  return null;
}

/**
 * Main function to fetch external metrics with fallback providers
 */
export async function fetchExternalMetrics(
  creatorUsername: string,
  platform: string
): Promise<ExternalMetrics | null> {
  // Try Modash first
  let metrics = await fetchModashMetrics(creatorUsername, platform);
  
  if (!metrics) {
    // Try alternative providers as fallback
    metrics = await fetchAlternativeMetrics(creatorUsername, platform);
  }
  
  return metrics;
}

/**
 * Cache metrics to avoid excessive API calls
 * This could be stored in Supabase or Redis for production
 */
export function shouldRefreshMetrics(lastUpdated: string): boolean {
  const lastUpdate = new Date(lastUpdated);
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  
  // Refresh metrics if they're older than 24 hours
  return hoursSinceUpdate > 24;
}
