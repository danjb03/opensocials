
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
    avgViews?: string;
    avgLikes?: string;
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
      console.log('Fetching creator profile for modal, ID:', creatorId);
      
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .limit(1)
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
          metrics: {
            followerCount: '100K',
            engagementRate: '5.2%'
          },
          industries: []
        });
        return;
      }

      if (data) {
        // Transform creator_profiles data to Creator interface
        const transformedCreator: Creator = {
          id: creatorId,
          name: data.display_name || 'Unknown Creator',
          platform: data.primary_platform || 'Unknown',
          imageUrl: '/placeholder.svg',
          followers: data.follower_count?.toString() || '0',
          engagement: data.engagement_rate ? `${data.engagement_rate}%` : '0%',
          audience: data.audience_type || 'Unknown',
          contentType: data.content_type || 'Unknown',
          location: data.audience_location || 'Global',
          bio: data.bio || '',
          about: data.bio || '',
          skills: data.categories || [],
          priceRange: '$500 - $2,000',
          bannerImageUrl: undefined,
          socialLinks: data.social_links || {},
          audienceLocation: {
            primary: data.audience_location || 'Global',
            secondary: [],
            countries: []
          },
          metrics: {
            followerCount: data.follower_count?.toString() || '0',
            engagementRate: data.engagement_rate ? `${data.engagement_rate}%` : '0%'
          },
          industries: data.industries || []
        };

        setSelectedCreator(transformedCreator);
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
