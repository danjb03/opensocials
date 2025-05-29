
export interface CreatorProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
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
  industries?: string[];
  creatorType?: string;
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
  social_links?: any | null;
  audience_stats?: any | null;
  headline?: string | null;
  rate_card_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
