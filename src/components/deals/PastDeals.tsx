import { useState } from 'react';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronDown, Target, ListChecks, Users } from 'lucide-react';

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

interface PastDealsProps {
  deals: Deal[];
}

const PastDeals = ({ deals }: PastDealsProps) => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Past Deals</h2>
        <span className="text-sm text-muted-foreground">
          {deals.length} past {deals.length === 1 ? 'deal' : 'deals'}
        </span>
      </div>

      {deals.length > 0 ? (
        <div className="space-y-2">
          {deals.map((deal) => (
            <div key={deal.id}>
              <Card 
                className="cursor-pointer transition-colors hover:bg-accent"
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
                          <Badge className={`${
                            deal.status === 'accepted' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                          </Badge>
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

                      {deal.feedback && (
                        <div>
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                            Feedback
                          </h4>
                          <p className="text-sm text-muted-foreground">{deal.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No past deals to show.
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default PastDeals;
