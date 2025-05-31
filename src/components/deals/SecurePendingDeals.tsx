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

const SecurePendingDeals = () => {
  const queryClient = useQueryClient();
  const { pendingDeals } = useCreatorDealStats();
  const { acceptDeal, declineDeal } = useCreatorDealActions();
  
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);

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

  const handleViewDealDetails = (deal: any) => {
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
  const convertDealForDialog = (deal: any) => {
    if (!deal) return null;
    
    return {
      id: deal.id,
      title: deal.project?.name || 'Campaign Offer',
      description: deal.project?.description || '',
      value: deal.deal_value, // This is the net value (after 25% margin)
      status: deal.status,
      feedback: deal.creator_feedback || '',
      creator_id: deal.creator_id,
      brand_id: deal.project?.brand_profile?.id || '',
      created_at: deal.created_at,
      updated_at: deal.updated_at,
      deadline: deal.project?.end_date || null,
      project_brief: deal.project?.description || null,
      campaign_goals: deal.project?.content_requirements?.messaging_guidelines || null,
      target_audience: null, // Not available in new structure
      deliverables: deal.project?.deliverables ? [
        ...(deal.project.deliverables.posts_count ? [`${deal.project.deliverables.posts_count} posts`] : []),
        ...(deal.project.deliverables.stories_count ? [`${deal.project.deliverables.stories_count} stories`] : []),
        ...(deal.project.deliverables.reels_count ? [`${deal.project.deliverables.reels_count} reels`] : [])
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