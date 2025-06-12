
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle, Users } from 'lucide-react';
import { Campaign } from './types';
import { getStatusColor, getUrgencyLevel } from './utils';

interface AgencyAllCampaignsProps {
  campaigns: Campaign[];
}

const AgencyAllCampaigns = ({ campaigns }: AgencyAllCampaignsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Campaigns</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monitor all campaigns across your managed brands. Click to view detailed progress.
        </p>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns to monitor</h3>
            <p className="text-muted-foreground">
              Your managed brands haven't created any campaigns yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const completedCampaignDeals = campaign.deals.filter((deal: any) => deal.status === 'completed');
              const urgency = getUrgencyLevel(campaign);
              const totalValue = campaign.deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
              
              return (
                <div key={campaign.title} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{campaign.title}</h4>
                      <Badge variant={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      {urgency === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Brand:</span> {campaign.brand_name}
                      </div>
                      <div>
                        <span className="font-medium">Value:</span> ${totalValue.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Deals:</span> {completedCampaignDeals.length}/{campaign.deals.length} completed
                      </div>
                      <div>
                        <span className="font-medium">Started:</span> {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {urgency === 'high' && (
                      <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Intervene
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Monitor
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgencyAllCampaigns;
