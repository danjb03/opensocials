
export interface CreatorModalData {
  id: number;
  name: string;
  platform: string;
  imageUrl: string;
  followers: string;
  engagement: string;
  audience: string;
  contentType: string;
  location: string;
  bio?: string;
  about?: string;
  skills?: string[];
  priceRange: string;
  bannerImageUrl?: string;
  socialLinks?: Record<string, string>;
  audienceLocation?: {
    primary: string;
    secondary?: string[];
    countries?: { name: string; percentage: number }[];
  };
  metrics?: {
    followerCount: string;
    engagementRate: string;
    avgViews: string;
    avgLikes: string;
    growthTrend?: string;
  };
  industries?: string[];
}
