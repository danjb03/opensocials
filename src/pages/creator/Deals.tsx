
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

// Define an interface for the deal with profiles included
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
  profiles: {
    company_name: string;
  };
}

const CreatorDeals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [feedbackText, setFeedbackText] = useState<{[key: string]: string}>({});

  const { data: deals } = useQuery({
    queryKey: ['creator-deals', user?.id],
    queryFn: async () => {
      // First, retrieve all brand IDs from the deals for this creator
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*, brand_id')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (dealsError) throw dealsError;
      
      // If we have deals, get the company names for all brand IDs
      if (dealsData && dealsData.length > 0) {
        const brandIds = dealsData.map(deal => deal.brand_id);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, company_name')
          .in('id', brandIds);
        
        if (profilesError) throw profilesError;
        
        // Map the company names to the deals
        const dealsWithCompanyNames = dealsData.map(deal => {
          const brandProfile = profilesData?.find(profile => profile.id === deal.brand_id);
          return {
            ...deal,
            profiles: {
              company_name: brandProfile?.company_name || 'Unknown Brand'
            }
          };
        }) as Deal[];
        
        return dealsWithCompanyNames;
      }
      
      return (dealsData || []) as Deal[];
    },
    enabled: !!user?.id,
  });

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
    },
    onError: (error) => {
      toast.error('Failed to update deal: ' + error.message);
    },
  });

  const handleDealAction = (dealId: string, status: string, feedback?: string) => {
    updateDealMutation.mutate({ dealId, status, feedback });
    setFeedbackText(prev => ({ ...prev, [dealId]: '' }));
  };

  const pendingDeals = deals?.filter(deal => deal.status === 'pending') || [];
  const otherDeals = deals?.filter(deal => deal.status !== 'pending') || [];

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">New Offers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingDeals.map((deal) => (
              <Card key={deal.id}>
                <CardHeader>
                  <CardTitle>{deal.title}</CardTitle>
                  <CardDescription>
                    From {deal.profiles?.company_name || 'Unknown Brand'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{deal.description}</p>
                  <p className="font-bold">Value: ${deal.value.toLocaleString()}</p>
                  <div className="mt-4">
                    <Textarea
                      placeholder="Provide feedback (required for decline or revision)"
                      value={feedbackText[deal.id] || ''}
                      onChange={(e) => setFeedbackText(prev => ({
                        ...prev,
                        [deal.id]: e.target.value
                      }))}
                    />
                  </div>
                </CardContent>
                <CardFooter className="space-x-2">
                  <Button 
                    onClick={() => handleDealAction(deal.id, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDealAction(deal.id, 'declined', feedbackText[deal.id])}
                    disabled={!feedbackText[deal.id]}
                  >
                    Decline
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {pendingDeals.length === 0 && (
              <p className="text-gray-500">No new offers at the moment.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Past Deals</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherDeals.map((deal) => (
              <Card key={deal.id}>
                <CardHeader>
                  <CardTitle>{deal.title}</CardTitle>
                  <CardDescription>
                    From {deal.profiles?.company_name || 'Unknown Brand'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{deal.description}</p>
                  <p className="font-bold">Value: ${deal.value.toLocaleString()}</p>
                  <p className="mt-2">
                    Status: <span className="capitalize">{deal.status}</span>
                  </p>
                  {deal.feedback && (
                    <div className="mt-2">
                      <p className="font-semibold">Feedback:</p>
                      <p>{deal.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {otherDeals.length === 0 && (
              <p className="text-gray-500">No past deals to show.</p>
            )}
          </div>
        </section>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDeals;
