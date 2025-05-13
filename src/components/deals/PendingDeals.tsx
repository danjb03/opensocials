
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DealCard from './DealCard';
import DealDetailDialog from './DealDetailDialog';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  deadline?: string | null;
  project_brief?: string | null;
  campaign_goals?: string | null;
  target_audience?: string | null;
  deliverables?: string[] | null;
  profiles: {
    company_name: string;
    logo_url?: string;
  };
}

interface PendingDealsProps {
  deals: Deal[];
}

const PendingDeals = ({ deals }: PendingDealsProps) => {
  const queryClient = useQueryClient();
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const updateDealMutation = useMutation({
    mutationFn: async ({ 
      dealId, 
      status, 
      feedback 
    }: { 
      dealId: string; 
      status: string; 
      feedback?: string; 
    }) => {
      const { error } = await supabase
        .from('deals')
        .update({ status, feedback, updated_at: new Date().toISOString() })
        .eq('id', dealId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-deals'] });
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

  const handleViewDealDetails = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  const handleCloseDealDetails = () => {
    setSelectedDeal(null);
  };

  const handleAcceptDeal = (dealId: string) => {
    updateDealMutation.mutate({ dealId, status: 'accepted' });
  };

  const handleDeclineDeal = (dealId: string, feedback: string) => {
    updateDealMutation.mutate({ dealId, status: 'declined', feedback });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pending Offers</h2>
        <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
          {deals.length} {deals.length === 1 ? 'offer' : 'offers'}
        </span>
      </div>
      
      <div className="space-y-3">
        {deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard 
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
        deal={selectedDeal}
        isOpen={!!selectedDeal}
        onClose={handleCloseDealDetails}
        onAccept={handleAcceptDeal}
        onDecline={handleDeclineDeal}
        isLoading={updateDealMutation.isPending}
      />
    </section>
  );
};

export default PendingDeals;
