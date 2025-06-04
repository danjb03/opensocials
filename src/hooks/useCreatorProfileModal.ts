
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
  // External API metrics - to be populated by Modash or similar
  externalMetrics?: {
    followerCount: number;
    engagementRate: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    reachRate: number;
    impressions: number;
    growthRate: number;
    lastUpdated: string;
  };
  industries?: string[];
}

export const useCreatorProfileModal = () => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);

  const handleViewCreatorProfile = async (creatorId: number) => {
    setIsLoadingCreator(true);
    setIsProfileModalOpen(true);

    try {
      // Fetch creator profile data from creator_profiles table
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', creatorId.toString())
        .single();

      if (error) {
        console.error('Error fetching creator for modal:', error);
        // Use mock data as fallback
        setSelectedCreator({
          id: creatorId,
          name: 'Creator Name',
          platform: 'Instagram',
          imageUrl: '/placeholder.svg',
          followers: '100K',
          engagement: '5.2%',
          audience: 'Gen Z',
          contentType: 'Short Form Video',
          location: 'Global',
          bio: 'Creator bio not available',
          about: 'Creator details not available',
          skills: ['Content Creation', 'Social Media'],
          priceRange: '$500 - $2,000',
          bannerImageUrl: undefined,
          socialLinks: {},
          audienceLocation: {
            primary: 'Global',
            secondary: [],
            countries: []
          },
          // External metrics will be fetched from Modash/similar APIs
          externalMetrics: undefined,
          industries: []
        });
        return;
      }

      if (data) {
        // Transform creator_profiles data to Creator interface
        // Safely handle social_handles JSON type
        const socialLinks: Record<string, string> = {};
        if (data.social_handles && typeof data.social_handles === 'object' && !Array.isArray(data.social_handles)) {
          Object.entries(data.social_handles).forEach(([key, value]) => {
            if (typeof value === 'string') {
              socialLinks[key] = value;
            }
          });
        }

        // Safe display name construction
        const displayName = data.first_name && data.last_name 
          ? `${data.first_name} ${data.last_name}`
          : data.username || 'Unknown Creator';

        // Safe location extraction
        let locationString = 'Global';
        if (typeof data.audience_location === 'string') {
          locationString = data.audience_location;
        } else if (data.audience_location && typeof data.audience_location === 'object') {
          const locationObj = data.audience_location as any;
          locationString = locationObj.primary || 'Global';
        }

        const transformedCreator: Creator = {
          id: creatorId,
          name: displayName,
          platform: data.primary_platform || 'Unknown',
          imageUrl: data.avatar_url || '/placeholder.svg',
          followers: data.follower_count?.toString() || '0',
          engagement: data.engagement_rate ? `${data.engagement_rate}%` : '0%',
          audience: data.audience_type || 'Unknown',
          contentType: data.content_type || 'Unknown',
          location: locationString,
          bio: data.bio || '',
          about: data.bio || '',
          skills: data.content_types || [],
          priceRange: '$500 - $2,000',
          bannerImageUrl: data.banner_url || undefined,
          socialLinks,
          audienceLocation: {
            primary: locationString,
            secondary: [],
            countries: []
          },
          // External metrics will be populated by API calls
          externalMetrics: undefined,
          industries: data.industries || []
        };

        setSelectedCreator(transformedCreator);

        // TODO: Fetch external metrics for this creator
        // This is where you would call Modash or similar API
        /*
        try {
          const externalMetrics = await fetchCreatorMetrics(creatorId, transformedCreator.platform);
          setSelectedCreator(prev => prev ? { ...prev, externalMetrics } : null);
        } catch (error) {
          console.error('Failed to fetch external metrics:', error);
        }
        */
      }
    } catch (error) {
      console.error('Error in handleViewCreatorProfile:', error);
    } finally {
      setIsLoadingCreator(false);
    }
  };

  const handleCloseProfileModal = () => {
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
