
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

      const { data, error } = await supabase
        .from('creator_public_analytics')
        .select('*')
        .eq('creator_id', creator_id)
        .order('fetched_at', { ascending: false });

      if (error) {
        console.error('Error fetching InsightIQ data:', error);
        throw error;
      }

      console.log('InsightIQ data fetched:', data);
      return data as InsightIQAnalytics[] || [];
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
