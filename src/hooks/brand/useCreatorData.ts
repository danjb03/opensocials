
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useCreatorData = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch external metrics for a creator (placeholder for Modash integration)
  const fetchExternalMetrics = async (creatorId: string, platform: string) => {
    console.log(`Fetching external metrics for creator ${creatorId} on ${platform}`);
    
    return {
      followerCount: 0,
      engagementRate: 0,
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      reachRate: 0,
      impressions: 0,
      growthRate: 0,
      lastUpdated: new Date().toISOString()
    };
  };

  // Fetch creators from creator_profiles table
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching creators from creator_profiles table');
        
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('*');

        if (error) {
          console.error('Error fetching creators:', error);
          toast.error('Failed to load creators');
          return;
        }

        console.log('Raw creator profiles data:', data);

        // Transform creator_profiles data to Creator interface
        const transformedCreators: Creator[] = (data || []).map((profile, index) => {
          // Safely handle social_handles JSON type
          const socialLinks: Record<string, string> = {};
          if (profile.social_handles && typeof profile.social_handles === 'object' && !Array.isArray(profile.social_handles)) {
            Object.entries(profile.social_handles).forEach(([key, value]) => {
              if (typeof value === 'string') {
                socialLinks[key] = value;
              }
            });
          }

          // Safe display name construction
          const displayName = profile.first_name && profile.last_name 
            ? `${profile.first_name} ${profile.last_name}`
            : profile.username || 'Unknown Creator';

          // Safe location extraction
          let locationString = 'Global';
          if (typeof profile.audience_location === 'string') {
            locationString = profile.audience_location;
          } else if (profile.audience_location && typeof profile.audience_location === 'object') {
            const locationObj = profile.audience_location as any;
            locationString = locationObj.primary || 'Global';
          }

          return {
            id: index + 1,
            name: displayName,
            platform: profile.primary_platform || 'Unknown',
            imageUrl: profile.avatar_url || '/placeholder.svg',
            followers: profile.follower_count?.toString() || '0',
            engagement: profile.engagement_rate ? `${profile.engagement_rate}%` : '0%',
            audience: profile.audience_type || 'Unknown',
            contentType: profile.content_type || 'Unknown',
            location: locationString,
            bio: profile.bio || '',
            about: profile.bio || '',
            skills: profile.content_types || [],
            priceRange: '$500 - $2,000',
            bannerImageUrl: profile.banner_url || undefined,
            socialLinks,
            audienceLocation: {
              primary: locationString,
              secondary: [],
              countries: []
            },
            externalMetrics: undefined,
            industries: profile.industries || []
          };
        });

        console.log('Transformed creators:', transformedCreators);
        setCreators(transformedCreators);
      } catch (error) {
        console.error('Error in fetchCreators:', error);
        toast.error('Failed to load creators');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, []);

  return {
    creators,
    isLoading,
    fetchExternalMetrics
  };
};
