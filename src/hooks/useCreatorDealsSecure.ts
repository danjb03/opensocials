
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

interface CreatorDealSecure {
  id: string;
  project_id: string;
  creator_id: string;
  deal_value: number;
  individual_requirements: any;
  status: 'pending' | 'invited' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  invited_at: string;
  responded_at?: string;
  creator_feedback?: string;
  payment_status: 'pending' | 'processing' | 'paid' | 'failed';
  paid_at?: string;
  created_at: string;
  updated_at: string;
  project?: {
    name: string;
    description?: string;
    campaign_type: string;
    start_date?: string;
    end_date?: string;
    content_requirements: any;
    deliverables: any;
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
    queryFn: async (): Promise<CreatorDealSecure[]> => {
      if (!user || !creatorProfile) {
        throw new Error('User or creator profile not found');
      }

      console.log('Fetching creator deals for user:', user.id);

      // First fetch deals
      const { data: deals, error: dealsError } = await supabase
        .from('creator_deals')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (dealsError) {
        console.error('Error fetching creator deals:', dealsError);
        throw dealsError;
      }

      console.log('Retrieved deals:', deals);

      // Then fetch project and brand info separately for each deal
      const dealsWithProjects = await Promise.all(
        (deals || []).map(async (deal) => {
          const { data: project } = await supabase
            .from('projects')
            .select(`
              name,
              description,
              campaign_type,
              start_date,
              end_date,
              content_requirements,
              brand_id
            `)
            .eq('id', deal.project_id)
            .single();

          let brandProfile = null;
          if (project?.brand_id) {
            const { data: brand } = await supabase
              .from('brand_profiles')
              .select('company_name, logo_url')
              .eq('user_id', project.brand_id)
              .single();
            brandProfile = brand;
          }

          return {
            id: deal.id,
            project_id: deal.project_id,
            creator_id: deal.creator_id,
            deal_value: deal.deal_value,
            individual_requirements: deal.individual_requirements,
            status: deal.status as CreatorDealSecure['status'],
            invited_at: deal.invited_at,
            responded_at: deal.responded_at || undefined,
            creator_feedback: deal.creator_feedback || undefined,
            payment_status: deal.payment_status as CreatorDealSecure['payment_status'],
            paid_at: deal.paid_at || undefined,
            created_at: deal.created_at,
            updated_at: deal.updated_at,
            project: project ? {
              name: project.name,
              description: project.description || undefined,
              campaign_type: project.campaign_type,
              start_date: project.start_date || undefined,
              end_date: project.end_date || undefined,
              content_requirements: project.content_requirements,
              deliverables: {},
              brand_profile: brandProfile ? {
                company_name: brandProfile.company_name,
                logo_url: brandProfile.logo_url || undefined
              } : undefined
            } : undefined
          };
        })
      );

      return dealsWithProjects;
    },
    enabled: !!user && !!creatorProfile,
    refetchInterval: 30000,
  });
};

// Helper functions for deal management
export const useCreatorDealActions = () => {
  const queryClient = useQueryClient();

  const acceptDeal = useMutation({
    mutationFn: async (dealId: string) => {
      const { data, error } = await supabase
        .from('creator_deals')
        .update({ 
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', dealId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Deal accepted successfully!');
      queryClient.invalidateQueries({ queryKey: ['creator-deals-secure'] });
    },
    onError: (error) => {
      console.error('Error accepting deal:', error);
      toast.error('Failed to accept deal');
    }
  });

  const declineDeal = useMutation({
    mutationFn: async ({ dealId, feedback }: { dealId: string; feedback?: string }) => {
      const { data, error } = await supabase
        .from('creator_deals')
        .update({ 
          status: 'declined',
          responded_at: new Date().toISOString(),
          creator_feedback: feedback || null
        })
        .eq('id', dealId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Deal declined');
      queryClient.invalidateQueries({ queryKey: ['creator-deals-secure'] });
    },
    onError: (error) => {
      console.error('Error declining deal:', error);
      toast.error('Failed to decline deal');
    }
  });

  return {
    acceptDeal: acceptDeal.mutate,
    declineDeal: declineDeal.mutate,
    isAccepting: acceptDeal.isPending,
    isDeclining: declineDeal.isPending
  };
};

// Helper to get deal statistics
export const useCreatorDealStats = () => {
  const { data: deals = [] } = useCreatorDealsSecure();

  const stats = {
    totalEarnings: deals
      .filter(deal => deal.payment_status === 'paid')
      .reduce((sum, deal) => sum + deal.deal_value, 0),
    activeDeals: deals.filter(deal => 
      ['accepted', 'pending'].includes(deal.status)
    ).length,
    completedDeals: deals.filter(deal => deal.status === 'completed').length,
    pipelineValue: deals
      .filter(deal => ['pending', 'invited', 'accepted'].includes(deal.status))
      .reduce((sum, deal) => sum + deal.deal_value, 0),
    pendingDeals: deals.filter(deal => deal.status === 'pending' || deal.status === 'invited'),
    acceptedDeals: deals.filter(deal => deal.status === 'accepted'),
    completedDealsList: deals.filter(deal => deal.status === 'completed')
  };

  return stats;
};
