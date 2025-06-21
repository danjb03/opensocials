
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
  externalMetrics?: {
    follower_count: number;
    engagement_rate: number;
    avg_views: number;
    avg_likes: number;
    avg_comments: number;
    reach_rate: number;
    impressions: number;
    growth_rate: number;
    last_updated: string;
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
    setSelectedCreator(null); // Clear previous creator while loading

    try {
      // Fetch creator profile data from creator_profiles table using user_id
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching creator for modal:', error);
        // Use mock data as fallback with a generated ID
        const mockCreator: Creator = {
          id: Math.floor(Math.random() * 1000000), // Generate a random ID for display
          name: 'Creator Profile',
          platform: 'Instagram',
          imageUrl: '/placeholder.svg',
          followers: '100K',
          engagement: '5.2%',
          audience: 'Gen Z',
          contentType: 'Short Form Video',
          location: 'Global',
          bio: 'This creator profile is currently being loaded. Please check back soon for detailed analytics and insights.',
          about: 'Creator analytics and performance data will be displayed here once fully loaded.',
          skills: ['Content Creation', 'Social Media', 'Brand Partnerships'],
          priceRange: '$500 - $2,000',
          bannerImageUrl: undefined,
          socialLinks: {
            instagram: '#',
            tiktok: '#'
          },
          audienceLocation: {
            primary: 'Global',
            secondary: ['United States', 'Canada'],
            countries: [
              { name: 'United States', percentage: 45 },
              { name: 'Canada', percentage: 25 },
              { name: 'United Kingdom', percentage: 15 },
              { name: 'Australia', percentage: 15 }
            ]
          },
          industries: ['Lifestyle', 'Fashion', 'Beauty']
        };
        
        setSelectedCreator(mockCreator);
        return;
      }

      if (data) {
        // Transform creator_profiles data to Creator interface
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
          id: Math.floor(Math.random() * 1000000), // Generate a random ID for display
          name: displayName,
          platform: data.primary_platform || 'Instagram',
          imageUrl: data.avatar_url || '/placeholder.svg',
          followers: data.follower_count?.toString() || '0',
          engagement: data.engagement_rate ? `${data.engagement_rate}%` : '0%',
          audience: data.audience_type || 'Gen Z',
          contentType: data.content_type || 'Short Form Video',
          location: locationString,
          bio: data.bio || 'This creator is building their presence and creating engaging content.',
          about: data.bio || 'This creator specializes in creating authentic, engaging content that resonates with their audience.',
          skills: data.content_types || ['Content Creation'],
          priceRange: '$500 - $2,000',
          bannerImageUrl: data.banner_url || undefined,
          socialLinks,
          audienceLocation: {
            primary: locationString,
            secondary: ['United States', 'Canada'],
            countries: [
              { name: 'United States', percentage: 45 },
              { name: 'Canada', percentage: 25 },
              { name: 'United Kingdom', percentage: 15 },
              { name: 'Australia', percentage: 15 }
            ]
          },
          externalMetrics: undefined,
          industries: data.industries || ['Lifestyle']
        };

        console.log('Setting transformed creator:', transformedCreator);
        setSelectedCreator(transformedCreator);
      }
    } catch (error) {
      console.error('Error in handleViewCreatorProfile:', error);
      // Set a fallback creator so the modal still shows something
      const fallbackCreator: Creator = {
        id: Math.floor(Math.random() * 1000000), // Generate a random ID for display
        name: 'Creator Profile',
        platform: 'Instagram',
        imageUrl: '/placeholder.svg',
        followers: 'Loading...',
        engagement: 'Loading...',
        audience: 'Gen Z',
        contentType: 'Short Form Video',
        location: 'Global',
        bio: 'Creator profile is being loaded...',
        about: 'Creator details are being loaded...',
        skills: ['Content Creation'],
        priceRange: '$500 - $2,000',
        socialLinks: {},
        audienceLocation: {
          primary: 'Global'
        },
        industries: []
      };
      setSelectedCreator(fallbackCreator);
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
