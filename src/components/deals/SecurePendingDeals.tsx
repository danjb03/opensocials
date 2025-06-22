
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Building2 } from 'lucide-react';
import { useCreatorDealActions } from '@/hooks/useCreatorDealsSecure';
import { LegacyDeal } from '@/types/deals';

interface SecurePendingDealsProps {
  deals: LegacyDeal[];
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
                <CardTitle className="text-lg">{deal.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4" />
                  {deal.profiles.company_name}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ${deal.value.toLocaleString()}
                </div>
                <Badge variant={deal.status === 'pending' ? 'secondary' : 'default'}>
                  {deal.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {deal.description && (
                <p className="text-sm text-muted-foreground">{deal.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Deal Type: Campaign
                </div>
                {deal.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created: {new Date(deal.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>

              {deal.status === 'pending' ? (
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
