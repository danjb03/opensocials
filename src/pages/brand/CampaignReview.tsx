
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CampaignReviewPanel from '@/components/brand/campaign-review/CampaignReviewPanel';
import { useCampaignSubmissions } from '@/hooks/useCampaignSubmissions';

const CampaignReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch campaign details
  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) throw new Error('Campaign ID required');
      
      const { data, error } = await supabase
        .from('projects_new')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch submissions to check readiness for launch
  const { data: submissions } = useCampaignSubmissions(id || '');

  const approvedSubmissions = submissions?.filter(s => s.status === 'approved') || [];
  const pendingSubmissions = submissions?.filter(s => s.status === 'submitted') || [];
  const allSubmissionsReviewed = pendingSubmissions.length === 0 && approvedSubmissions.length > 0;

  const handleLaunchCampaign = async () => {
    if (!id || !campaign) return;

    try {
      // Update campaign status to live
      const { error } = await supabase
        .from('projects_new')
        .update({
          status: 'live',
          review_stage: 'live'
        })
        .eq('id', id);

      if (error) throw error;

      // Create notifications for all approved creators
      const notifications = approvedSubmissions.map(submission => ({
        user_id: submission.creator_id,
        campaign_id: id,
        submission_id: submission.id,
        notification_type: 'campaign_launched',
        title: 'Time to Post Your Content!',
        message: `Your content for "${campaign.name}" has been approved. Please post it now.`
      }));

      if (notifications.length > 0) {
        await supabase
          .from('campaign_notifications')
          .insert(notifications);
      }

      navigate('/brand/orders', { state: { message: 'Campaign launched successfully! Creators have been notified.' } });
    } catch (error) {
      console.error('Error launching campaign:', error);
    }
  };

  if (campaignLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-gray-500">Campaign not found</p>
            <Button onClick={() => navigate('/brand/orders')} className="mt-4">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/brand/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <p className="text-muted-foreground">Campaign Review & Launch</p>
          </div>
        </div>

        {/* Launch Button */}
        {allSubmissionsReviewed && (
          <Button
            onClick={handleLaunchCampaign}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
        )}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedSubmissions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Readiness */}
      {allSubmissionsReviewed && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">Ready to Launch!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              All content has been reviewed and approved. Click "Launch Campaign" to notify creators to post their content.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Review Panel */}
      <CampaignReviewPanel
        campaignId={id || ''}
        campaignName={campaign.name}
      />
    </div>
  );
};

export default CampaignReview;
