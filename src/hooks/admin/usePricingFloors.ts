
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PricingFloor {
  id: string;
  tier: string;
  campaign_type: string;
  min_price: number;
  created_at: string;
  updated_at: string;
}

export const usePricingFloors = () => {
  return useQuery({
    queryKey: ['pricing-floors'],
    queryFn: async (): Promise<PricingFloor[]> => {
      const { data, error } = await supabase
        .from('pricing_floors')
        .select('*')
        .order('tier', { ascending: true })
        .order('campaign_type', { ascending: true });

      if (error) {
        console.error('Error fetching pricing floors:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useUpdatePricingFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, min_price }: { id: string; min_price: number }) => {
      const { data, error } = await supabase
        .from('pricing_floors')
        .update({ min_price })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-floors'] });
      toast.success('Pricing floor updated successfully');
    },
    onError: (error) => {
      console.error('Error updating pricing floor:', error);
      toast.error('Failed to update pricing floor');
    },
  });
};

export const useCreatePricingFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tier, campaign_type, min_price }: { tier: string; campaign_type: string; min_price: number }) => {
      const { data, error } = await supabase
        .from('pricing_floors')
        .insert({ tier, campaign_type, min_price })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-floors'] });
      toast.success('Pricing floor created successfully');
    },
    onError: (error) => {
      console.error('Error creating pricing floor:', error);
      toast.error('Failed to create pricing floor');
    },
  });
};

export const useDeletePricingFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pricing_floors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-floors'] });
      toast.success('Pricing floor deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting pricing floor:', error);
      toast.error('Failed to delete pricing floor');
    },
  });
};
