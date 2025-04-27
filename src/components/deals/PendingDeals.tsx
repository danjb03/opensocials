import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, Target, ListChecks, Users, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  };
}

interface PendingDealsProps {
  deals: Deal[];
}

const PendingDeals = ({ deals }: PendingDealsProps) => {
  const queryClient = useQueryClient();
  const [feedbackText, setFeedbackText] = useState<{[key: string]: string}>({});
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">New Offers</h2>
        <span className="text-sm text-muted-foreground">
          {deals.length} pending {deals.length === 1 ? 'offer' : 'offers'}
        </span>
      </div>
      
      {deals.length > 0 ? (
        <div className="space-y-2">
          {deals.map((deal) => {
            const deadline = deal.deadline ? new Date(deal.deadline) : null;
            const today = new Date();
            const daysLeft = deadline 
              ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              : null;
            
            return (
              <div key={deal.id}>
                <Card 
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    daysLeft !== null && daysLeft <= 1 ? 'border-red-300' : ''
                  }`}
                  onClick={() => setSelectedDeal(deal)}
                >
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{deal.title}</CardTitle>
                            <CardDescription>{deal.profiles.company_name}</CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${deal.value.toLocaleString()}</p>
                            {deadline && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className={`h-4 w-4 ${
                                  daysLeft !== null && daysLeft <= 1 ? 'text-red-500' : 
                                  daysLeft !== null && daysLeft <= 3 ? 'text-amber-500' : 'text-green-500'
                                }`} />
                                <span className={`text-sm ${
                                  daysLeft !== null && daysLeft <= 1 ? 'text-red-500 font-medium' : 
                                  daysLeft !== null && daysLeft <= 3 ? 'text-amber-500' : 'text-muted-foreground'
                                }`}>
                                  {daysLeft !== null && daysLeft > 0 
                                    ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} to decide` 
                                    : daysLeft === 0 
                                    ? 'Due today' 
                                    : 'Expired'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </div>
                  </CardHeader>
                </Card>

                <Dialog open={selectedDeal?.id === deal.id} onOpenChange={() => setSelectedDeal(null)}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{deal.title}</DialogTitle>
                      <DialogDescription>{deal.profiles.company_name}</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <div className="grid gap-6">
                        {deal.project_brief && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <ListChecks className="h-4 w-4" /> Project Brief
                            </h4>
                            <p className="text-sm text-muted-foreground">{deal.project_brief}</p>
                          </div>
                        )}
                        
                        {deal.campaign_goals && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4" /> Campaign Goals
                            </h4>
                            <p className="text-sm text-muted-foreground">{deal.campaign_goals}</p>
                          </div>
                        )}
                        
                        {deal.target_audience && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4" /> Target Audience
                            </h4>
                            <p className="text-sm text-muted-foreground">{deal.target_audience}</p>
                          </div>
                        )}
                        
                        {deal.deliverables && deal.deliverables.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <ListChecks className="h-4 w-4" /> Deliverables
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {deal.deliverables.map((item, idx) => (
                                <Badge key={idx} variant="secondary">{item}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Textarea
                          placeholder="Feedback (required for declining)"
                          value={feedbackText[deal.id] || ''}
                          onChange={(e) => setFeedbackText(prev => ({
                            ...prev,
                            [deal.id]: e.target.value
                          }))}
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => {
                              handleDealAction(deal.id, 'accepted');
                              setSelectedDeal(null);
                            }}
                          >
                            Accept Offer
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              handleDealAction(deal.id, 'declined', feedbackText[deal.id]);
                              setSelectedDeal(null);
                            }}
                            disabled={!feedbackText[deal.id]}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No new offers at the moment.
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default PendingDeals;
