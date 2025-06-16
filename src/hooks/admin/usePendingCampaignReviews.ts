
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePendingCampaignReviews = () => {
  return useQuery({
    queryKey: ['pending-campaign-reviews'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('projects_new')
        .select('*', { count: 'exact', head: true })
        .eq('review_status', 'pending_review');

      if (error) {
        console.error('Error fetching pending campaign reviews:', error);
        throw error;
      }

      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep count updated
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
