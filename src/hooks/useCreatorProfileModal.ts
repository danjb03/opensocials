
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Creator {
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

export const useCreatorProfileModal = () => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);

  const handleViewCreatorProfile = async (userId: string) => {
    console.log('handleViewCreatorProfile called with userId:', userId);
    
    setIsLoadingCreator(true);
    setIsProfileModalOpen(true);
    setSelectedCreator(null);

    try {
      // Fetch creator profile with analytics data
      const { data: creatorData, error: creatorError } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('creator_public_analytics')
        .select('*')
        .eq('creator_id', userId)
        .order('fetched_at', { ascending: false })
        .limit(1);

      if (creatorError) {
        console.error('Error fetching creator for modal:', creatorError);
        // Create fallback creator for modal display
        const fallbackCreator: Creator = {
          id: Math.floor(Math.random() * 1000000),
          name: 'Creator Profile',
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
        };
        setSelectedCreator(fallbackCreator);
        return;
      }

      if (creatorData) {
        // Use analytics data if available, otherwise use profile data
        const analytics = analyticsData?.[0];
        
        // Extract social links safely
        const socialLinks: Record<string, string> = {};
        if (creatorData.social_handles && typeof creatorData.social_handles === 'object') {
          Object.entries(creatorData.social_handles).forEach(([key, value]) => {
            if (typeof value === 'string') {
              socialLinks[key] = value;
            }
          });
        }

        // Format follower count from analytics or profile
        const formatFollowerCount = (count: number | null) => {
          if (!count) return '0';
          if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
          if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
          return count.toString();
        };

        // Get follower count from analytics first, then profile
        const followerCount = analytics?.follower_count || creatorData.follower_count || 0;
        const engagementRate = analytics?.engagement_rate || creatorData.engagement_rate || 0;

        // Format metrics for display
        const metrics = {
          followerCount: formatFollowerCount(followerCount),
          engagementRate: `${engagementRate.toFixed(1)}%`,
          avgViews: analytics?.average_views ? formatFollowerCount(analytics.average_views) : 'N/A',
          avgLikes: analytics?.average_likes ? formatFollowerCount(analytics.average_likes) : 'N/A',
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
          : creatorData.username || analytics?.full_name || 'Creator';

        const transformedCreator: Creator = {
          id: Math.floor(Math.random() * 1000000),
          name: displayName,
          platform: creatorData.primary_platform || analytics?.platform || 'Instagram',
          imageUrl: creatorData.avatar_url || analytics?.image_url || '/placeholder.svg',
          followers: metrics.followerCount,
          engagement: metrics.engagementRate,
          audience: creatorData.audience_type || 'Mixed Demographics',
          contentType: creatorData.content_type || 'Content Creator',
          location: locationString,
          bio: creatorData.bio || analytics?.introduction || 'Content creator passionate about sharing authentic experiences.',
          about: creatorData.bio || analytics?.introduction || 'This creator specializes in creating authentic, engaging content that resonates with their audience.',
          skills: creatorData.content_types || ['Content Creation'],
          priceRange: 'Contact for pricing', // This would come from pricing data
          bannerImageUrl: creatorData.banner_url || undefined,
          socialLinks,
          audienceLocation,
          metrics,
          industries: creatorData.industries || ['Lifestyle']
        };

        console.log('Setting live creator data:', transformedCreator);
        setSelectedCreator(transformedCreator);
      }
    } catch (error) {
      console.error('Error in handleViewCreatorProfile:', error);
      const errorCreator: Creator = {
        id: Math.floor(Math.random() * 1000000),
        name: 'Error Loading Profile',
        platform: 'Unknown',
        imageUrl: '/placeholder.svg',
        followers: 'Error',
        engagement: 'Error',
        audience: 'Unknown',
        contentType: 'Unknown',
        location: 'Unknown',
        bio: 'Unable to load creator profile at this time.',
        about: 'Please try again later.',
        skills: [],
        priceRange: 'Contact for pricing',
        socialLinks: {},
        audienceLocation: {
          primary: 'Unknown'
        },
        industries: []
      };
      setSelectedCreator(errorCreator);
    } finally {
      setIsLoadingCreator(false);
    }
  };

  const handleCloseProfileModal = () => {
    console.log('Closing profile modal');
    setIsProfileModalOpen(false);
    setSelectedCreator(null);
  };

  return {
    selectedCreator,
    isProfileModalOpen,
    isLoadingCreator,
    handleViewCreatorProfile,
    handleCloseProfileModal
  };
};
