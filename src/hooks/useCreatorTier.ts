
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatorTier } from '@/utils/tierPricing';

export const useCreatorTier = (creatorId: string | null) => {
  return useQuery({
    queryKey: ['creator-tier', creatorId],
    queryFn: async (): Promise<CreatorTier | null> => {
      if (!creatorId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('creator_tier')
        .eq('id', creatorId)
        .single();

      if (error) {
        console.error('Error fetching creator tier:', error);
        throw error;
      }

      // Default to 'Nano' if no tier is set
      return (data?.creator_tier as CreatorTier) || 'Nano';
    },
    enabled: !!creatorId,
  });
};
