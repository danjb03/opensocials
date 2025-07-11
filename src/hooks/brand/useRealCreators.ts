
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RealCreator {
  id: string;
  name: string;
  platform: string;
  audience: string;
  contentType: string;
  followers: string;
  engagement: string;
  priceRange: string;
  skills: string[];
  imageUrl: string;
  username?: string;
  bio?: string;
  industries?: string[];
}

export interface CreatorFilters {
  platform?: string;
  audience?: string;
  contentType?: string;
  priceRange?: string;
  skills?: string[];
  search?: string;
}

export const useRealCreators = (filters?: CreatorFilters) => {
  return useQuery({
    queryKey: ['real-creators', filters],
    queryFn: async (): Promise<RealCreator[]> => {
      let query = supabase
        .from('creator_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          username,
          bio,
          primary_platform,
          follower_count,
          engagement_rate,
          content_types,
          platforms,
          industries,
          avatar_url,
          audience_type,
          creator_public_analytics(
            image_url,
            profile_url,
            platform,
            follower_count,
            engagement_rate
          )
        `)
        .eq('is_profile_complete', true);

      // Apply filters
      if (filters?.platform && filters.platform !== 'all') {
        query = query.contains('platforms', [filters.platform]);
      }

      if (filters?.audience && filters.audience !== 'all') {
        query = query.eq('audience_type', filters.audience);
      }

      if (filters?.contentType && filters.contentType !== 'all') {
        query = query.contains('content_types', [filters.contentType]);
      }

      if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(creator => {
        // Use analytics data if available, otherwise fall back to profile data
        const analyticsData = Array.isArray(creator.creator_public_analytics) && creator.creator_public_analytics.length > 0 
          ? creator.creator_public_analytics[0] 
          : null;
        
        const followerCount = analyticsData?.follower_count || creator.follower_count || 0;
        const engagementRate = analyticsData?.engagement_rate || creator.engagement_rate || 0;
        
        let priceRange = '$250-600';
        
        // Estimate price range based on follower count
        if (followerCount > 100000) {
          priceRange = '$1500-3000';
        } else if (followerCount > 50000) {
          priceRange = '$1000-2000';
        } else if (followerCount > 10000) {
          priceRange = '$500-1000';
        }

        // Use actual profile image from analytics data, fallback to avatar_url, then to a default
        const profileImage = analyticsData?.image_url || 
                           creator.avatar_url || 
                           `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`;

        return {
          id: creator.id,
          name: `${creator.first_name} ${creator.last_name}`,
          platform: creator.primary_platform || 'instagram',
          audience: creator.audience_type || 'millennials',
          contentType: creator.content_types?.[0] || 'photo',
          followers: followerCount ? `${Math.floor(followerCount / 1000)}K` : '0K',
          engagement: `${engagementRate || 0}%`,
          priceRange,
          skills: creator.industries || [],
          imageUrl: profileImage,
          username: creator.username,
          bio: creator.bio,
          industries: creator.industries,
        };
      }) || [];
    },
  });
};
