
import { useNavigate } from 'react-router-dom';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import ErrorBoundary from '@/components/ErrorBoundary';

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
    <ErrorBoundary>
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/creator/campaigns')} 
            className="mb-6 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <ErrorBoundary fallback={() => (
                    <div className="p-4">
                      <h2 className="text-xl font-bold text-white">Campaign Details</h2>
                      <p className="text-muted-foreground">Campaign header temporarily unavailable</p>
                    </div>
                  )}>
                    <CampaignHeader campaign={campaign} getPlatformIcon={getPlatformIcon} />
                  </ErrorBoundary>
                </CardHeader>

                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6 bg-black border border-white/10">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 hover:text-white">Overview</TabsTrigger>
                      <TabsTrigger value="requirements" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 hover:text-white">Requirements</TabsTrigger>
                      <TabsTrigger value="uploads" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 hover:text-white">Uploads</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <ErrorBoundary fallback={() => (
                        <div className="p-4 text-white">Campaign overview temporarily unavailable</div>
                      )}>
                        <CampaignOverview campaign={campaign} />
                      </ErrorBoundary>
                    </TabsContent>

                    <TabsContent value="requirements">
                      <ErrorBoundary fallback={() => (
                        <div className="p-4 text-white">Campaign requirements temporarily unavailable</div>
                      )}>
                        <CampaignRequirements campaign={campaign} />
                      </ErrorBoundary>
                    </TabsContent>

                    <TabsContent value="uploads">
                      <ErrorBoundary fallback={() => (
                        <div className="p-4 text-white">Campaign uploads temporarily unavailable</div>
                      )}>
                        <CampaignUploads campaign={campaign} isCompleted={isCompleted} />
                      </ErrorBoundary>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <ErrorBoundary fallback={() => (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-white">Campaign timeline temporarily unavailable</p>
                  </CardContent>
                </Card>
              )}>
                <CampaignTimeline campaign={campaign} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default CampaignDetail;
