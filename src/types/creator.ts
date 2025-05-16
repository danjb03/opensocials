
export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  contentRequirements: Record<string, any>;
  brandId: string;
  platforms: string[];
  dealId: string;
  value: number;
  deadline: string;
  brandName: string;
  brandLogo: string | null;
  uploads: any[];
}

export interface Creator {
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
  bannerImageUrl?: string;
  about?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
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
  audienceLocation?: {
    primary: string;
    secondary?: string[];
    countries?: { name: string; percentage: number }[];
  };
  industries?: string[];
  matchScore?: number;
}
