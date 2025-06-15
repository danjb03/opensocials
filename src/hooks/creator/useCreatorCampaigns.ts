
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
  } | null;
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
    queryKey: ['creator-campaigns', creatorProfile?.user_id],
    queryFn: async (): Promise<CreatorCampaign[]> => {
      if (!creatorProfile?.user_id) return [];

      const { data, error } = await supabase
        .from('projects_new')
        .select(`
          *,
          brand_profiles (
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
        .eq('creator_deals.creator_id', creatorProfile.user_id)
        .eq('review_status', 'approved') // Only show approved campaigns
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creator campaigns:', error);
        throw error;
      }

      return (data || []).map(campaign => {
        // Safely handle brand_profiles using optional chaining and type guards
        const brandProfiles = (campaign.brand_profiles && 
                             typeof campaign.brand_profiles === 'object' &&
                             !Array.isArray(campaign.brand_profiles) &&
                             'company_name' in campaign.brand_profiles &&
                             typeof campaign.brand_profiles.company_name === 'string') 
          ? { company_name: campaign.brand_profiles.company_name }
          : null;

        return {
          ...campaign,
          brand_profiles: brandProfiles
        };
      }) as CreatorCampaign[];
    },
    enabled: !!creatorProfile?.user_id,
  });
};

export const useCreatorPendingInvitations = () => {
  const { creatorProfile } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-pending-invitations', creatorProfile?.user_id],
    queryFn: async (): Promise<CreatorCampaign[]> => {
      if (!creatorProfile?.user_id) return [];

      const { data, error } = await supabase
        .from('projects_new')
        .select(`
          *,
          brand_profiles (
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
        .eq('creator_deals.creator_id', creatorProfile.user_id)
        .eq('creator_deals.status', 'invited')
        .in('review_status', ['pending_review', 'under_review']) // Show campaigns under review
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending invitations:', error);
        throw error;
      }

      return (data || []).map(campaign => {
        // Safely handle brand_profiles using optional chaining and type guards
        const brandProfiles = (campaign.brand_profiles && 
                             typeof campaign.brand_profiles === 'object' &&
                             !Array.isArray(campaign.brand_profiles) &&
                             'company_name' in campaign.brand_profiles &&
                             typeof campaign.brand_profiles.company_name === 'string') 
          ? { company_name: campaign.brand_profiles.company_name }
          : null;

        return {
          ...campaign,
          brand_profiles: brandProfiles
        };
      }) as CreatorCampaign[];
    },
    enabled: !!creatorProfile?.user_id,
  });
};
