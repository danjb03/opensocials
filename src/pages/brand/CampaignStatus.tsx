import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { CampaignDetails } from '@/components/brand/dashboard/campaigns/CampaignDetails';
import { CampaignAnalytics } from '@/components/brand/dashboard/campaigns/CampaignAnalytics';
import { CampaignCreators } from '@/components/brand/dashboard/campaigns/CampaignCreators';

const CampaignStatus = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (campaignId) {
      console.log(`Campaign ID: ${campaignId}`);
    }
  }, [campaignId]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Campaign Status
            {campaignId && (
              <Badge variant="secondary" className="ml-2">
                ID: {campaignId}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="creators">Creators</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <CampaignDetails campaignId={campaignId || ''} />
            </TabsContent>
            <TabsContent value="analytics">
              <CampaignAnalytics campaignId={campaignId || ''} />
            </TabsContent>
            <TabsContent value="creators">
              <CampaignCreators campaignId={campaignId || ''} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignStatus;
