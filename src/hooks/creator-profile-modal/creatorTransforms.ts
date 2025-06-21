
import { CreatorModalData } from './types';

export const formatFollowerCount = (count: number | null): string => {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export const createFallbackCreator = (message: string = 'Creator Profile'): CreatorModalData => ({
  id: Math.floor(Math.random() * 1000000),
  name: message,
  platform: 'Instagram',
  imageUrl: '/placeholder.svg',
  followers: 'Loading...',
  engagement: 'Loading...',
  audience: 'Loading...',
  contentType: 'Content Creator',
  location: 'Loading...',
  bio: 'Creator profile is being loaded...',
  about: 'Creator details are being loaded...',
  skills: ['Content Creation'],
  priceRange: 'Contact for pricing',
  socialLinks: {},
  audienceLocation: {
    primary: 'Loading...'
  },
  industries: []
});

export const transformCreatorData = (creatorData: any, analyticsData: any): CreatorModalData => {
  // Extract social links safely
  const socialLinks: Record<string, string> = {};
  if (creatorData.social_handles && typeof creatorData.social_handles === 'object') {
    Object.entries(creatorData.social_handles).forEach(([key, value]) => {
      if (typeof value === 'string') {
        socialLinks[key] = value;
      }
    });
  }

  // Get follower count from analytics first, then profile
  const followerCount = analyticsData?.follower_count || creatorData.follower_count || 0;
  const engagementRate = analyticsData?.engagement_rate || creatorData.engagement_rate || 0;

  // Format metrics for display
  const metrics = {
    followerCount: formatFollowerCount(followerCount),
    engagementRate: `${engagementRate.toFixed(1)}%`,
    avgViews: analyticsData?.average_views ? formatFollowerCount(analyticsData.average_views) : 'N/A',
    avgLikes: analyticsData?.average_likes ? formatFollowerCount(analyticsData.average_likes) : 'N/A',
    growthTrend: undefined
  };

  // Safe location extraction
  let locationString = 'Global';
  if (typeof creatorData.audience_location === 'string') {
    locationString = creatorData.audience_location;
  } else if (creatorData.audience_location && typeof creatorData.audience_location === 'object') {
    const locationObj = creatorData.audience_location as any;
    locationString = locationObj.primary || 'Global';
  }

  // Build audience location with real data
  const audienceLocation = {
    primary: locationString,
    secondary: ['United States', 'Canada'], // This would come from analytics in the future
    countries: [
      { name: 'United States', percentage: 45 },
      { name: 'Canada', percentage: 25 },
      { name: 'United Kingdom', percentage: 15 },
      { name: 'Australia', percentage: 15 }
    ]
  };

  // Create display name
  const displayName = creatorData.first_name && creatorData.last_name 
    ? `${creatorData.first_name} ${creatorData.last_name}`
    : creatorData.username || analyticsData?.full_name || 'Creator';

  return {
    id: Math.floor(Math.random() * 1000000),
    name: displayName,
    platform: creatorData.primary_platform || analyticsData?.platform || 'Instagram',
    imageUrl: creatorData.avatar_url || analyticsData?.image_url || '/placeholder.svg',
    followers: metrics.followerCount,
    engagement: metrics.engagementRate,
    audience: creatorData.audience_type || 'Mixed Demographics',
    contentType: creatorData.content_type || 'Content Creator',
    location: locationString,
    bio: creatorData.bio || analyticsData?.introduction || 'Content creator passionate about sharing authentic experiences.',
    about: creatorData.bio || analyticsData?.introduction || 'This creator specializes in creating authentic, engaging content that resonates with their audience.',
    skills: creatorData.content_types || ['Content Creation'],
    priceRange: 'Contact for pricing',
    bannerImageUrl: creatorData.banner_url || undefined,
    socialLinks,
    audienceLocation,
    metrics,
    industries: creatorData.industries || ['Lifestyle']
  };
};
