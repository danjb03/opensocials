import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Json } from '@/integrations/supabase/types';

interface CreatorDealSecure {
  id: string;
  project_id: string;
  creator_id: string;
  deal_value: number; // Net value only (after 25% margin)
  individual_requirements: Json;
  status: 'pending' | 'invited' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  invited_at: string;
  responded_at?: string;
  creator_feedback?: string;
  payment_status: 'pending' | 'processing' | 'paid' | 'failed';
  paid_at?: string;
  created_at: string;
  updated_at: string;
  // Project details
  project?: {
    name: string;
    description?: string;
    campaign_type: string;
    start_date?: string;
    end_date?: string;
    content_requirements: Json;
    deliverables: Json;
    brand_profile?: {
      company_name: string;
      logo_url?: string;
    };
  };
}

export const useCreatorDealsSecure = () => {
  const { user, creatorProfile } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-deals-secure', user?.id],
    queryFn: async () => {
      if (!user || !creatorProfile) {
        throw new Error('User or creator profile not found');
      }

      // Use the creator_deal_view which only exposes net values
      const { data, error } = await supabase
        .from('creator_deal_view')
        .select(`
          *,
          project:projects_new (
            name,
            description,
            campaign_type,
            start_date,
            end_date,
            content_requirements,
            deliverables,
            brand_profile:brand_profiles (
              company_name,
              logo_url
            )
          )
        `)
        .eq('creator_id', creatorProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creator deals:', error);
        throw error;
      }

      return (data || []) as CreatorDealSecure[];
    },
    enabled: !!user && !!creatorProfile,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

// Helper functions for deal management
export const useCreatorDealActions = () => {
  const acceptDeal = async (dealId: string) => {
    const { error } = await supabase
      .from('creator_deals')
      .update({ 
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', dealId);

    if (error) throw error;
  };

  const declineDeal = async (dealId: string, feedback?: string) => {
    const { error } = await supabase
      .from('creator_deals')
      .update({ 
        status: 'declined',
        responded_at: new Date().toISOString(),
        creator_feedback: feedback
      })
      .eq('id', dealId);

    if (error) throw error;
  };

  return {
    acceptDeal,
    declineDeal
  };
};

// Helper to get deal statistics (all values are net amounts)
export const useCreatorDealStats = () => {
  const { data: deals = [] } = useCreatorDealsSecure();

  const stats = {
    totalEarnings: deals
      .filter(deal => deal.status === 'completed' && deal.payment_status === 'paid')
      .reduce((sum, deal) => sum + deal.deal_value, 0),
    
    activeDeals: deals.filter(deal => 
      deal.status === 'accepted' && deal.payment_status !== 'paid'
    ).length,
    
    completedDeals: deals.filter(deal => 
      deal.status === 'completed'
    ).length,
    
    pipelineValue: deals
      .filter(deal => ['pending', 'invited', 'accepted'].includes(deal.status))
      .reduce((sum, deal) => sum + deal.deal_value, 0),
    
    pendingDeals: deals.filter(deal => 
      ['pending', 'invited'].includes(deal.status)
    ),
    
    acceptedDeals: deals.filter(deal => 
      deal.status === 'accepted'
    ),
    
    completedDealsList: deals.filter(deal => 
      deal.status === 'completed'
    )
  };

  return stats;
};