
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePricingFloorsByType = (campaignType: string) => {
  return useQuery({
    queryKey: ['pricing-floors', campaignType],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!campaignType) return {};

      const { data, error } = await supabase
        .from('pricing_floors')
        .select('tier, min_price')
        .eq('campaign_type', campaignType);

      if (error) {
        console.error('Error fetching pricing floors:', error);
        return {};
      }

      return data?.reduce((acc, item) => {
        acc[item.tier] = item.min_price;
        return acc;
      }, {} as Record<string, number>) || {};
    },
    enabled: !!campaignType,
  });
};
