
export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  contentRequirements: {
    content_types?: string[];
    platforms?: string[];
    messaging_guidelines?: string;
    hashtags?: string[];
    mentions?: string[];
    style_preferences?: string;
    restrictions?: string[];
  };
  brandId: string;
  platforms: string[];
  dealId: string;
  value: number;
  deadline: string;
  brandName: string;
  brandLogo: string | null;
  uploads: {
    id: string;
    filename: string;
    url: string;
    uploadedAt: string;
    status?: 'pending' | 'approved' | 'rejected';
  }[];
}

export interface Creator {
  id: string; // Changed from number to string to support UUIDs
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
  bio?: string; // Added bio property
  location?: string; // Added location property
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
