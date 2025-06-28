
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InsightIQAnalytics {
  id: string;
  creator_id: string;
  platform: string;
  work_platform_id: string | null;
  identifier: string;
  fetched_at: string;
  profile_url: string | null;
  image_url: string | null;
  full_name: string | null;
  is_verified: boolean | null;
  follower_count: number | null;
  engagement_rate: number | null;
  platform_account_type: string | null;
  introduction: string | null;
  gender: string | null;
  age_group: string | null;
  language: string | null;
  content_count: number | null;
  average_likes: number | null;
  average_comments: number | null;
  average_views: number | null;
  average_reels_views: number | null;
  sponsored_posts_performance: number | null;
  credibility_score: number | null;
  top_contents: any | null;
  recent_contents: any | null;
  sponsored_contents: any | null;
  top_hashtags: any | null;
  top_mentions: any | null;
  top_interests: any | null;
  brand_affinity: any | null;
  audience: any | null;
  pricing: any | null;
  created_at: string;
  updated_at: string;
}

interface UseInsightIQDataReturn {
  data: InsightIQAnalytics[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useInsightIQData = (creator_id: string): UseInsightIQDataReturn => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['insightiq-data', creator_id],
    queryFn: async () => {
      if (!creator_id) {
        console.log('No creator_id provided to useInsightIQData');
        return [];
      }

      console.log('Fetching InsightIQ data for creator:', creator_id);

      // First try to get data from creator_public_analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('creator_public_analytics')
        .select('*')
        .eq('creator_id', creator_id)
        .order('fetched_at', { ascending: false });

      if (analyticsError) {
        console.error('Error fetching analytics data:', analyticsError);
      }

      // Also get creator profile data for any additional metrics
      const { data: profileData, error: profileError } = await supabase
        .from('creator_profiles')
        .select('follower_count, engagement_rate, updated_at')
        .eq('user_id', creator_id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile data:', profileError);
      }

      console.log('Analytics data fetched:', analyticsData);
      console.log('Profile data fetched:', profileData);

      // If we have analytics data, use it; otherwise create basic entries from profile data
      if (analyticsData && analyticsData.length > 0) {
        return analyticsData as InsightIQAnalytics[] || [];
      } else if (profileData && (profileData.follower_count || profileData.engagement_rate)) {
        // Create a basic analytics entry from profile data
        console.log('Creating basic analytics from profile data');
        return [{
          id: crypto.randomUUID(),
          creator_id,
          platform: 'instagram', // Default platform
          work_platform_id: null,
          identifier: 'unknown',
          fetched_at: profileData.updated_at || new Date().toISOString(),
          profile_url: null,
          image_url: null,
          full_name: null,
          is_verified: false,
          follower_count: profileData.follower_count || 0,
          engagement_rate: profileData.engagement_rate || 0,
          platform_account_type: null,
          introduction: null,
          gender: null,
          age_group: null,
          language: null,
          content_count: 0,
          average_likes: 0,
          average_comments: 0,
          average_views: 0,
          average_reels_views: 0,
          sponsored_posts_performance: 0,
          credibility_score: 0,
          top_contents: null,
          recent_contents: null,
          sponsored_contents: null,
          top_hashtags: null,
          top_mentions: null,
          top_interests: null,
          brand_affinity: null,
          audience: null,
          pricing: null,
          created_at: profileData.updated_at || new Date().toISOString(),
          updated_at: profileData.updated_at || new Date().toISOString(),
        }] as InsightIQAnalytics[];
      } else {
        console.log('No analytics or profile data found');
        return [];
      }
    },
    enabled: !!creator_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    retryOnMount: false,
  });

  return {
    data: data || null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
