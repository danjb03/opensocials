
export type Creator = {
  id: number;
  name: string;
  platform: string;
  audience: string;
  contentType: string;
  followers: string;
  engagement: string;
  priceRange: string;
  skills: string[];
  imageUrl: string;
  matchScore?: number;
  // New fields for enhanced creator profile
  about?: string;
  bannerImageUrl?: string;
  socialLinks?: {
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
  };
  metrics?: {
    followerCount: string;
    engagementRate: string;
    avgViews: string;
    avgLikes: string;
    growthTrend?: string;
  };
  // New audience location information
  audienceLocation?: {
    primary: string;
    secondary?: string[];
    countries?: {
      name: string;
      percentage: number;
    }[];
  };
  // Content categories/industries that the creator specializes in
  industries?: string[];
  // Creator type classification
  creatorType?: string;
};
