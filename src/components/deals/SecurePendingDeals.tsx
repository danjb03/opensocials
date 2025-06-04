
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import SecureDealCard from './SecureDealCard';
import DealDetailDialog from './DealDetailDialog';
import { useCreatorDealStats, useCreatorDealActions } from '@/hooks/useCreatorDealsSecure';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Json } from '@/integrations/supabase/types';

interface CreatorDealSecure {
  id: string;
  project_id: string;
  creator_id: string;
  deal_value: number;
  individual_requirements: Json;
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
    content_requirements: Json;
    deliverables: Json;
    brand_profile?: {
      company_name: string;
      logo_url?: string;
    };
  };
}

const SecurePendingDeals = () => {
  const queryClient = useQueryClient();
  const { pendingDeals } = useCreatorDealStats();
  const { acceptDeal, declineDeal } = useCreatorDealActions();
  
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<CreatorDealSecure | null>(null);

  const updateDealMutation = useMutation({
    mutationFn: async ({ 
      dealId, 
      action,
      feedback 
    }: { 
      dealId: string; 
      action: 'accept' | 'decline';
      feedback?: string; 
    }) => {
      if (action === 'accept') {
        await acceptDeal(dealId);
      } else {
        await declineDeal(dealId, feedback);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-deals-secure'] });
      toast.success('Deal updated successfully');
      setSelectedDeal(null);
    },
    onError: (error) => {
      toast.error('Failed to update deal: ' + error.message);
    },
  });
  
  const toggleExpandDeal = (dealId: string) => {
    setExpandedDealId(prevId => prevId === dealId ? null : dealId);
  };

  const handleViewDealDetails = (deal: CreatorDealSecure) => {
    setSelectedDeal(deal);
  };

  const handleCloseDealDetails = () => {
    setSelectedDeal(null);
  };

  const handleAcceptDeal = (dealId: string) => {
    updateDealMutation.mutate({ dealId, action: 'accept' });
  };

  const handleDeclineDeal = (dealId: string, feedback: string) => {
    updateDealMutation.mutate({ dealId, action: 'decline', feedback });
  };

  // Convert secure deals to legacy format for DealDetailDialog compatibility
  const convertDealForDialog = (deal: CreatorDealSecure | null) => {
    if (!deal) return null;
    
    // Safe JSON parsing helpers
    const getContentRequirements = () => {
      try {
        if (typeof deal.project?.content_requirements === 'object' && deal.project?.content_requirements !== null) {
          return deal.project.content_requirements as any;
        }
        return {};
      } catch {
        return {};
      }
    };

    const getDeliverables = () => {
      try {
        if (typeof deal.project?.deliverables === 'object' && deal.project?.deliverables !== null) {
          return deal.project.deliverables as any;
        }
        return {};
      } catch {
        return {};
      }
    };

    const contentRequirements = getContentRequirements();
    const deliverables = getDeliverables();
    
    return {
      id: deal.id,
      title: deal.project?.name || 'Campaign Offer',
      description: deal.project?.description || '',
      value: deal.deal_value, // This is the net value (after 25% margin)
      status: deal.status,
      feedback: deal.creator_feedback || '',
      creator_id: deal.creator_id,
      brand_id: 'unknown', // Not available in new structure
      created_at: deal.created_at,
      updated_at: deal.updated_at,
      deadline: deal.project?.end_date || null,
      project_brief: deal.project?.description || null,
      campaign_goals: (contentRequirements as any)?.messaging_guidelines || null,
      target_audience: null, // Not available in new structure
      deliverables: deliverables ? [
        ...((deliverables as any)?.posts_count ? [`${(deliverables as any).posts_count} posts`] : []),
        ...((deliverables as any)?.stories_count ? [`${(deliverables as any).stories_count} stories`] : []),
        ...((deliverables as any)?.reels_count ? [`${(deliverables as any).reels_count} reels`] : [])
      ] : [],
      profiles: {
        company_name: deal.project?.brand_profile?.company_name || 'Unknown Brand',
        logo_url: deal.project?.brand_profile?.logo_url
      }
    };
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pending Offers</h2>
        <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
          {pendingDeals.length} {pendingDeals.length === 1 ? 'offer' : 'offers'}
        </span>
      </div>
      
      <div className="space-y-3">
        {pendingDeals.length > 0 ? (
          pendingDeals.map((deal) => (
            <SecureDealCard 
              key={deal.id}
              deal={deal}
              isExpanded={expandedDealId === deal.id}
              onToggleExpand={() => toggleExpandDeal(deal.id)}
              onViewDetails={() => handleViewDealDetails(deal)}
            />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12h8"/>
                </svg>
              </div>
              <h3 className="font-medium text-base mb-1">No pending offers</h3>
              <p className="text-sm text-muted-foreground">
                When brands invite you to collaborate, their offers will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <DealDetailDialog 
        deal={convertDealForDialog(selectedDeal)}
        isOpen={!!selectedDeal}
        onClose={handleCloseDealDetails}
        onAccept={handleAcceptDeal}
        onDecline={handleDeclineDeal}
        isLoading={updateDealMutation.isPending}
      />
    </section>
  );
};

export default SecurePendingDeals;
