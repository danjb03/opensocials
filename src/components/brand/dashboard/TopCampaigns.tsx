
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, User, Eye } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  reach: string;
  engagement: string;
  platform: string;
  imageUrl?: string;
}

interface TopCampaignsProps {
  campaigns: Campaign[];
}

const TopCampaigns: React.FC<TopCampaignsProps> = ({ campaigns }) => {
  if (campaigns.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5" />
          Top Performing Campaigns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="border rounded-md overflow-hidden bg-background">
              <div className="h-32 bg-muted relative">
                {campaign.imageUrl ? (
                  <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                    Campaign Visual
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-foreground">
                  {campaign.platform}
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium mb-2 text-foreground">{campaign.title}</h4>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-foreground" />
                    <span className="text-foreground">{campaign.reach} Reach</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-foreground" />
                    <span className="text-foreground">{campaign.engagement} Engagement</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCampaigns;
