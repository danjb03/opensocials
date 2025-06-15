
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

interface CreatorCampaign {
  id: string;
  name: string;
  campaign_type: string;
  budget: number;
  currency: string;
  status: string;
  review_status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  brand_profiles?: {
    company_name: string;
  };
  creator_deals?: {
    id: string;
    status: string;
    deal_value: number;
    invited_at: string;
    responded_at: string;
  }[];
}

export const useCreatorCampaigns = () => {
  const { creatorProfile } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-campaigns', creatorProfile?.id],
    queryFn: async (): Promise<CreatorCampaign[]> => {
      if (!creatorProfile?.id) return [];

      const { data, error } = await supabase
        .from('projects_new')
        .select(`
          *,
          brand_profiles!inner (
            company_name
          ),
          creator_deals!inner (
            id,
            status,
            deal_value,
            invited_at,
            responded_at
          )
        `)
        .eq('creator_deals.creator_id', creatorProfile.id)
        .eq('review_status', 'approved') // Only show approved campaigns
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creator campaigns:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!creatorProfile?.id,
  });
};

export const useCreatorPendingInvitations = () => {
  const { creatorProfile } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-pending-invitations', creatorProfile?.id],
    queryFn: async (): Promise<CreatorCampaign[]> => {
      if (!creatorProfile?.id) return [];

      const { data, error } = await supabase
        .from('projects_new')
        .select(`
          *,
          brand_profiles!inner (
            company_name
          ),
          creator_deals!inner (
            id,
            status,
            deal_value,
            invited_at,
            responded_at
          )
        `)
        .eq('creator_deals.creator_id', creatorProfile.id)
        .eq('creator_deals.status', 'invited')
        .in('review_status', ['pending_review', 'under_review']) // Show campaigns under review
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending invitations:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!creatorProfile?.id,
  });
};
