
'use client'

import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useCampaigns } from './campaigns/useCampaigns';
import { CampaignEmpty } from './campaigns/CampaignEmpty';
import { CampaignError } from './campaigns/CampaignError';
import { CampaignLoading } from './campaigns/CampaignLoading';
import { CampaignList } from './campaigns/CampaignList';

export default function BrandCampaignTable() {
  const { campaigns, isLoading, error, refetch } = useCampaigns();
  const navigate = useNavigate();

  console.log('BrandCampaignTable state:', { campaigns, isLoading, error });

  const handleViewProject = (projectId: string) => {
    console.log('Navigating to project:', projectId);
    navigate(`/brand/orders?projectId=${projectId}`);
  };

  if (isLoading) {
    return (
      <Card className="shadow-md rounded-xl overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold">
            Your Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignLoading />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Your Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignError error={error} onRetry={refetch} />
        </CardContent>
      </Card>
    );
  }

  console.log('About to render campaigns. Data:', campaigns, 'Length:', campaigns?.length);

  return (
    <Card className="shadow-md rounded-xl overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="text-xl font-bold">
          Your Campaigns ({campaigns?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!campaigns || campaigns.length === 0 ? (
          <CampaignEmpty />
        ) : (
          <CampaignList 
            campaigns={campaigns}
            onViewProject={handleViewProject}
          />
        )}
      </CardContent>
    </Card>
  );
}
