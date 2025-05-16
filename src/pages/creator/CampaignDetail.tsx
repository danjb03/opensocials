
import { useNavigate } from 'react-router-dom';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import { CampaignHeader } from '@/components/creator/campaign-detail/CampaignHeader';
import { CampaignOverview } from '@/components/creator/campaign-detail/CampaignOverview';
import { CampaignRequirements } from '@/components/creator/campaign-detail/CampaignRequirements';
import { CampaignUploads } from '@/components/creator/campaign-detail/CampaignUploads';
import { CampaignTimeline } from '@/components/creator/campaign-detail/CampaignTimeline';
import { CampaignNotFound } from '@/components/creator/campaign-detail/CampaignNotFound';
import { CampaignLoading } from '@/components/creator/campaign-detail/CampaignLoading';

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { campaign, isLoading, activeTab, setActiveTab, getPlatformIcon } = useCampaignDetail();

  if (isLoading) {
    return (
      <CreatorLayout>
        <CampaignLoading />
      </CreatorLayout>
    );
  }

  if (!campaign) {
    return (
      <CreatorLayout>
        <CampaignNotFound />
      </CreatorLayout>
    );
  }

  const today = new Date();
  const startDate = parseISO(campaign.startDate);
  const endDate = parseISO(campaign.endDate);
  
  const isActive = isBefore(startDate, today) && isAfter(endDate, today);
  const isUpcoming = isAfter(startDate, today);
  const isCompleted = isBefore(endDate, today) || campaign.status === 'completed';

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/creator/campaigns')} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CampaignHeader campaign={campaign} getPlatformIcon={getPlatformIcon} />
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="uploads">Uploads</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <CampaignOverview campaign={campaign} />
                  </TabsContent>

                  <TabsContent value="requirements">
                    <CampaignRequirements campaign={campaign} />
                  </TabsContent>

                  <TabsContent value="uploads">
                    <CampaignUploads campaign={campaign} isCompleted={isCompleted} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <CampaignTimeline campaign={campaign} />
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CampaignDetail;
