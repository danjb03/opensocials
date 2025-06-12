
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePricingMinimum = (tier: string, campaignType: string) => {
  return useQuery({
    queryKey: ['pricing-minimum', tier, campaignType],
    queryFn: async (): Promise<number | null> => {
      if (!tier || !campaignType) return null;

      const { data, error } = await supabase
        .from('pricing_floors')
        .select('min_price')
        .eq('tier', tier)
        .eq('campaign_type', campaignType)
        .single();

      if (error) {
        console.error('Error fetching pricing minimum:', error);
        return null;
      }

      return data?.min_price || null;
    },
    enabled: !!tier && !!campaignType,
  });
};

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
