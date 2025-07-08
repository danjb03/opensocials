import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatorCampaignList } from '@/components/creator/campaigns/CreatorCampaignList';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const CreatorCampaigns = () => {
  const { user } = useUnifiedAuth();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <CreatorCampaignList creatorId={user.id} />
          ) : (
            <p>Loading user data...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorCampaigns;
