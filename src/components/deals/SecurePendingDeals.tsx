
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Building2 } from 'lucide-react';
import { useCreatorDealActions } from '@/hooks/useCreatorDealsSecure';

interface Deal {
  id: string;
  project_id: string;
  deal_value: number;
  status: string;
  invited_at: string;
  project?: {
    name: string;
    description?: string;
    campaign_type: string;
    start_date?: string;
    end_date?: string;
    brand_profile?: {
      company_name: string;
      logo_url?: string;
    };
  };
}

interface SecurePendingDealsProps {
  deals: Deal[];
}

const SecurePendingDeals = ({ deals }: SecurePendingDealsProps) => {
  const { acceptDeal, declineDeal, isAccepting, isDeclining } = useCreatorDealActions();

  if (deals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No pending deals</h3>
          <p className="text-sm text-muted-foreground">New opportunities will appear here when brands invite you to campaigns.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <Card key={deal.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{deal.project?.name || 'Untitled Campaign'}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4" />
                  {deal.project?.brand_profile?.company_name || 'Unknown Brand'}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ${deal.deal_value.toLocaleString()}
                </div>
                <Badge variant={deal.status === 'invited' ? 'secondary' : 'default'}>
                  {deal.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {deal.project?.description && (
                <p className="text-sm text-muted-foreground">{deal.project.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Campaign: {deal.project?.campaign_type || 'Single'}
                </div>
                {deal.project?.start_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Start: {new Date(deal.project.start_date).toLocaleDateString()}
                  </div>
                )}
              </div>

              {deal.status === 'invited' || deal.status === 'pending' ? (
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => acceptDeal(deal.id)}
                    disabled={isAccepting || isDeclining}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isAccepting ? 'Accepting...' : 'Accept Deal'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => declineDeal({ dealId: deal.id })}
                    disabled={isAccepting || isDeclining}
                  >
                    {isDeclining ? 'Declining...' : 'Decline'}
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <Badge variant="outline">Response submitted</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SecurePendingDeals;
