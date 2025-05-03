import { supabase } from "@/integrations/supabase/client";

// Base URL for our edge functions
const FUNCTIONS_BASE_URL = "https://functions.opensocials.net/functions/v1";

// Common callback URL for all platforms
const CALLBACK_URL = `${FUNCTIONS_BASE_URL}/auth-callback`;

// Platform-specific OAuth configuration
export interface OAuthConfig {
  url: string;
  clientId: string;
  scope: string[];
  additionalParams?: Record<string, string>;
}

// OAuth configurations for each supported platform
const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  instagram: {
    url: "https://www.facebook.com/v18.0/dialog/oauth",
    clientId: "254187407622116", // Meta App ID
    scope: ["instagram_basic", "instagram_content_publish", "pages_show_list"],
    additionalParams: {
      auth_type: "rerequest"
    }
  },
  tiktok: {
    url: "https://open-api.tiktok.com/platform/oauth/connect",
    clientId: "aw9olqsh6e9bm8b2", // TikTok Client Key
    scope: ["user.info.basic", "video.list"]
  },
  youtube: {
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: "506531212355-7ufg4q0bc8ihmr722kbm7l5hi5oqo4dh.apps.googleusercontent.com", // Google Client ID
    scope: ["https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/youtube.force-ssl"],
    additionalParams: {
      response_type: "code",
      access_type: "offline"
    }
  },
  linkedin: {
    url: "https://www.linkedin.com/oauth/v2/authorization",
    clientId: "77d5adora6wqlt", // LinkedIn Client ID
    scope: ["r_liteprofile", "r_emailaddress"],
    additionalParams: {
      response_type: "code"
    }
  }
};

/**
 * Initiates the OAuth flow for a specific platform
 */
export const initiateOAuth = async (platform: string): Promise<void> => {
  try {
    // Get current user ID to use as state parameter
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const config = OAUTH_CONFIGS[platform];
    if (!config) throw new Error(`Unsupported platform: ${platform}`);

    // Create state parameter containing user ID and platform
    const state = btoa(JSON.stringify({
      userId: user.id,
      platform,
      timestamp: Date.now()
    }));

    // Build the OAuth URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: CALLBACK_URL,
      scope: config.scope.join(" "),
      state,
      ...config.additionalParams
    });

    // Redirect to the OAuth provider
    window.location.href = `${config.url}?${params.toString()}`;
  } catch (error) {
    console.error(`Error initiating ${platform} OAuth:`, error);
    throw error;
  }
};

/**
 * Checks if the user just returned from an OAuth flow
 */
export const checkOAuthRedirect = (): { connected: string | null } => {
  const urlParams = new URLSearchParams(window.location.search);
  const connected = urlParams.get('connected');
  
  // Clean up URL if we have a connection parameter
  if (connected) {
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
  
  return { connected };
};

/**
 * Fetches analytics for a specific platform
 */
export const fetchPlatformAnalytics = async (platform: string) => {
  try {
    // First check if we have cached metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('social_metrics')
      .select('data')
      .eq('social_account_id', platform)
      .order('fetched_at', { ascending: false })
      .limit(1);

    // If we have cached metrics, return them
    if (metrics && metrics.length > 0) {
      return metrics[0].data;
    }
    
    // Otherwise trigger a refresh (would typically be handled by a webhook or background job)
    console.log(`Analytics fetch triggered for ${platform}`);
    
    // For demo purposes, returning mock data
    // In production, you'd call an edge function to fetch fresh data
    return {
      followers: platform === 'instagram' ? '15.2K' : platform === 'tiktok' ? '22.4K' : '8.7K',
      engagement: platform === 'instagram' ? '3.2%' : platform === 'tiktok' ? '5.7%' : '2.8%',
      growth: platform === 'instagram' ? '+2.5%' : platform === 'tiktok' ? '+4.1%' : '+1.2%',
    };
  } catch (error) {
    console.error(`Error fetching analytics for ${platform}:`, error);
    throw error;
  }
};
