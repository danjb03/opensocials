
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle } from 'lucide-react';
import { Campaign } from './types';
import { getUrgencyLevel } from './utils';

interface AgencyAttentionCampaignsProps {
  campaigns: Campaign[];
}

const AgencyAttentionCampaigns = ({ campaigns }: AgencyAttentionCampaignsProps) => {
  if (campaigns.length === 0) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Campaigns Requiring Attention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaigns.map((campaign) => {
            const urgency = getUrgencyLevel(campaign);
            const pendingDeals = campaign.deals.filter((deal: any) => deal.status === 'pending');
            
            return (
              <div key={campaign.title} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{campaign.title}</h4>
                    <Badge variant={urgency === 'high' ? 'destructive' : 'secondary'}>
                      {urgency} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pendingDeals.length} pending deal{pendingDeals.length !== 1 ? 's' : ''} • {campaign.brand_name}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgencyAttentionCampaigns;
