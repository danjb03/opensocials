
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  profiles: {
    company_name: string;
  };
}

interface PendingDealsProps {
  deals: Deal[];
}

const PendingDeals = ({ deals }: PendingDealsProps) => {
  const queryClient = useQueryClient();
  const [feedbackText, setFeedbackText] = useState<{[key: string]: string}>({});

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

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">New Offers</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {deals.map((deal) => (
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
        {deals.length === 0 && (
          <p className="text-gray-500">No new offers at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default PendingDeals;

