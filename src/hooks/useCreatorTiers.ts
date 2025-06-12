
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCreatorTiers = (creatorIds: string[]) => {
  return useQuery({
    queryKey: ['creator-tiers', creatorIds],
    queryFn: async (): Promise<Record<string, string>> => {
      if (!creatorIds || creatorIds.length === 0) return {};

      const { data, error } = await supabase
        .from('profiles')
        .select('id, creator_tier')
        .in('id', creatorIds);

      if (error) {
        console.error('Error fetching creator tiers:', error);
        return {};
      }

      return data?.reduce((acc, profile) => {
        acc[profile.id] = profile.creator_tier || 'Nano';
        return acc;
      }, {} as Record<string, string>) || {};
    },
    enabled: creatorIds.length > 0,
  });
};
