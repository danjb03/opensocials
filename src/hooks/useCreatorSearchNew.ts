
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export interface CreatorSearchResult {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement_rate: number;
}

export const useCreatorSearchNew = () => {
  const { user } = useUnifiedAuth();

  const query = useQuery({
    queryKey: ['creator-search', user?.id],
    queryFn: async (): Promise<CreatorSearchResult[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .limit(50);

      if (error) {
        console.error('Error fetching creators:', error);
        throw error;
      }

      return data?.map(creator => ({
        id: creator.id,
        name: `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Unknown Creator',
        platform: creator.primary_platform || 'Unknown',
        followers: creator.follower_count || 0,
        engagement_rate: creator.engagement_rate || 0
      })) || [];
    },
    enabled: !!user?.id
  });

  return {
    ...query,
    setSelectedCampaignId: () => {} // Placeholder function
  };
};
