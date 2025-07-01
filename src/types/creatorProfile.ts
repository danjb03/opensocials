
export interface CreatorProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl?: string | null; // Make this optional
  primaryPlatform: string;
  contentType: string;
  audienceType: string;
  followerCount: string;
  engagementRate: string;
  isProfileComplete: boolean;
  socialConnections: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    linkedin: boolean;
  };
  visibilitySettings: {
    showInstagram: boolean;
    showTiktok: boolean;
    showYoutube: boolean;
    showLinkedin: boolean;
    showLocation: boolean;
    showAnalytics: boolean;
  };
  audienceLocation: {
    primary: string;
    secondary?: string[];
    countries?: { name: string; percentage: number }[];
  };
  industries: string[];
  creatorType: string;
  platforms: string[];
  contentTypes: string[];
  // Add missing properties that components expect
  completion?: number;
  socialAccountsConnected?: boolean;
  // Database field mappings (snake_case) - These match the actual database columns
  follower_count?: number;
  engagement_rate?: number;
  creator_type?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  primary_platform?: string;
  audience_location?: any;
  content_types?: string[];
  audience_type?: string;
  is_profile_complete?: boolean;
  social_accounts_connected?: boolean;
}

export interface CreatorProfileRecord {
  user_id: string;
  display_name: string | null;
  bio?: string | null;
  follower_count?: number | null;
  engagement_rate?: number | null;
  primary_platform?: string | null;
  content_type?: string | null;
  audience_type?: string | null;
  audience_location?: string | null;
  creator_type?: string | null;
  industries?: string[] | null;
  categories?: string[] | null;
  platform_types?: string[] | null;
  social_links?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  } | null;
  audience_stats?: {
    follower_count?: number;
    engagement_rate?: number;
    avg_views?: number;
    avg_likes?: number;
    growth_trend?: 'up' | 'down' | 'stable';
    audience_location?: {
      primary: string;
      secondary?: string[];
      countries?: { name: string; percentage: number }[];
    };
  } | null;
  headline?: string | null;
  rate_card_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
