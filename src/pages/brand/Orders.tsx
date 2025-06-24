import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Calendar, Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
type CampaignWithStats = {
  id: string;
  name: string;
  status: string;
  review_stage: string;
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
  creator_count: number;
  submission_count: number;
  pending_reviews: number;
  approved_content: number;
};
const BrandOrders = () => {
  const navigate = useNavigate();
  const {
    user
  } = useUnifiedAuth();

  // Fetch campaigns with stats
  const {
    data: campaigns,
    isLoading
  } = useQuery({
    queryKey: ['brand-campaigns', user?.id],
    queryFn: async (): Promise<CampaignWithStats[]> => {
      if (!user?.id) return [];
      const {
        data: projects,
        error
      } = await supabase.from('projects_new').select(`
          id,
          name,
          status,
          review_stage,
          budget,
          start_date,
          end_date,
          created_at
        `).eq('brand_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;

      // Get stats for each campaign
      const campaignsWithStats = await Promise.all((projects || []).map(async project => {
        // Get creator count
        const {
          count: creatorCount
        } = await supabase.from('creator_deals').select('*', {
          count: 'exact',
          head: true
        }).eq('project_id', project.id);

        // Get submission stats
        const {
          data: submissions
        } = await supabase.from('campaign_submissions').select('status').eq('campaign_id', project.id);
        const submissionCount = submissions?.length || 0;
        const pendingReviews = submissions?.filter(s => s.status === 'submitted').length || 0;
        const approvedContent = submissions?.filter(s => s.status === 'approved').length || 0;
        return {
          ...project,
          creator_count: creatorCount || 0,
          submission_count: submissionCount,
          pending_reviews: pendingReviews,
          approved_content: approvedContent
        };
      }));
      return campaignsWithStats;
    },
    enabled: !!user?.id
  });
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'campaign_setup':
        return 'bg-gray-100 text-gray-800';
      case 'awaiting_submissions':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing_content':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready_to_launch':
        return 'bg-green-100 text-green-800';
      case 'live':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStageText = (stage: string) => {
    switch (stage) {
      case 'campaign_setup':
        return 'Setup';
      case 'awaiting_submissions':
        return 'Awaiting Content';
      case 'reviewing_content':
        return 'Under Review';
      case 'ready_to_launch':
        return 'Ready to Launch';
      case 'live':
        return 'Live';
      case 'completed':
        return 'Completed';
      default:
        return stage;
    }
  };
  const campaignsByStage = {
    review: campaigns?.filter(c => ['awaiting_submissions', 'reviewing_content', 'ready_to_launch'].includes(c.review_stage)) || [],
    live: campaigns?.filter(c => c.review_stage === 'live') || [],
    completed: campaigns?.filter(c => c.review_stage === 'completed') || []
  };
  const CampaignCard = ({
    campaign
  }: {
    campaign: CampaignWithStats;
  }) => <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <Badge className={getStageColor(campaign.review_stage)}>
            {getStageText(campaign.review_stage)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{campaign.creator_count} creators</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>${campaign.budget?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'No date'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span>{campaign.submission_count} submissions</span>
          </div>
        </div>

        {/* Review indicators */}
        {campaign.pending_reviews > 0 && <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {campaign.pending_reviews} submission{campaign.pending_reviews !== 1 ? 's' : ''} need review
            </span>
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              Action Required
            </Badge>
          </div>}

        {campaign.approved_content > 0 && campaign.pending_reviews === 0 && campaign.review_stage === 'ready_to_launch' && <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <span className="text-sm text-green-700">Ready to launch!</span>
            <Badge className="bg-green-100 text-green-800 text-xs">
              Launch Ready
            </Badge>
          </div>}

        <Button variant="outline" className="w-full" onClick={() => navigate(`/brand/campaign-review/${campaign.id}`)}>
          <Eye className="h-4 w-4 mr-2" />
          {campaign.pending_reviews > 0 ? 'Review Content' : 'View Campaign'}
        </Button>
      </CardContent>
    </Card>;
  if (isLoading) {
    return <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded"></div>)}
          </div>
        </div>
      </div>;
  }
  return <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Orders</h1>
          <p className="text-muted-foreground">Manage your campaigns from creation to completion</p>
        </div>
        <Button onClick={() => navigate('/brand/create-campaign')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Tabs for different stages */}
      <Tabs defaultValue="review" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="review" className="relative">
            Campaign Review
            {campaignsByStage.review.length > 0 && <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
                {campaignsByStage.review.length}
              </Badge>}
          </TabsTrigger>
          <TabsTrigger value="live">
            Live Campaigns
            {campaignsByStage.live.length > 0 && <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-green-500">
                {campaignsByStage.live.length}
              </Badge>}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Campaigns
            {campaignsByStage.completed.length > 0 && <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-gray-500">
                {campaignsByStage.completed.length}
              </Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Campaigns Under Review</h2>
            {campaignsByStage.review.length > 0 ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaignsByStage.review.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}
              </div> : <Card>
                <CardContent className="pt-6 text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-slate-50">No Campaigns Under Review</h3>
                  <p className="text-gray-500 mb-4">Create your first campaign to get started</p>
                  <Button onClick={() => navigate('/brand/create-campaign')}>
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Campaigns</h2>
            {campaignsByStage.live.length > 0 ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaignsByStage.live.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}
              </div> : <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-slate-50">No Live Campaigns</h3>
                  <p className="text-gray-500">Launch campaigns after reviewing and approving creator content</p>
                </CardContent>
              </Card>}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed Campaigns</h2>
            {campaignsByStage.completed.length > 0 ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaignsByStage.completed.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}
              </div> : <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Campaigns</h3>
                  <p className="text-gray-500">Completed campaigns will appear here</p>
                </CardContent>
              </Card>}
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default BrandOrders;