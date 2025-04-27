import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, Target, ListChecks, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

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

  const toggleDealExpand = (dealId: string) => {
    setExpandedDealId(expandedDealId === dealId ? null : dealId);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">New Offers</h2>
        <span className="text-sm text-muted-foreground">
          {deals.length} pending {deals.length === 1 ? 'offer' : 'offers'}
        </span>
      </div>
      
      {deals.length > 0 ? (
        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
          {deals.map((deal) => {
            const deadline = deal.deadline ? new Date(deal.deadline) : null;
            const today = new Date();
            const daysLeft = deadline 
              ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              : null;
            
            return (
              <Card key={deal.id} className={daysLeft !== null && daysLeft <= 1 ? 'border-red-300' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{deal.title}</CardTitle>
                      <CardDescription className="mt-1">{deal.profiles.company_name}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">${deal.value.toLocaleString()}</p>
                      {deadline && (
                        <div className="flex items-center justify-end mt-1 gap-1">
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
                </CardHeader>
                
                <CardContent className="pb-1">
                  <p className="text-muted-foreground">{deal.description}</p>
                  
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="project-details">
                      <AccordionTrigger className="py-2 text-sm">View Project Details</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {deal.project_brief && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                              <ListChecks className="h-4 w-4" /> Project Brief
                            </h4>
                            <p className="text-sm text-muted-foreground">{deal.project_brief}</p>
                          </div>
                        )}
                        
                        {deal.campaign_goals && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                              <Target className="h-4 w-4" /> Campaign Goals
                            </h4>
                            <p className="text-sm text-muted-foreground">{deal.campaign_goals}</p>
                          </div>
                        )}
                        
                        {deal.target_audience && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                              <Users className="h-4 w-4" /> Target Audience
                            </h4>
                            <p className="text-sm text-muted-foreground">{deal.target_audience}</p>
                          </div>
                        )}
                        
                        {deal.deliverables && deal.deliverables.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                              <ListChecks className="h-4 w-4" /> Deliverables
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {deal.deliverables.map((item, idx) => (
                                <Badge key={idx} variant="secondary">{item}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {deal.deadline && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                              <CalendarDays className="h-4 w-4" /> Decision Deadline
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(deal.deadline).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                
                <CardFooter className="flex flex-col pt-4">
                  <div className="w-full">
                    <Textarea
                      className="mb-3"
                      placeholder="Feedback (required for declining)"
                      value={feedbackText[deal.id] || ''}
                      onChange={(e) => setFeedbackText(prev => ({
                        ...prev,
                        [deal.id]: e.target.value
                      }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2 w-full">
                    <Button 
                      size="sm"
                      onClick={() => handleDealAction(deal.id, 'accepted')}
                    >
                      Accept Offer
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDealAction(deal.id, 'declined', feedbackText[deal.id])}
                      disabled={!feedbackText[deal.id]}
                    >
                      Decline
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )})}
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
