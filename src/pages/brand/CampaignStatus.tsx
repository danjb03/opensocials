
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandLayout from '@/components/layouts/BrandLayout';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { supabase } from '@/integrations/supabase/client';

interface CampaignStatus {
  id: string;
  name: string;
  campaign_type: string;
  budget: number;
  currency: string;
  status: string;
  review_status: string;
  created_at: string;
  updated_at: string;
  campaign_reviews?: {
    id: string;
    human_decision: string;
    review_notes: string;
    reviewed_at: string;
  }[];
}

const statusConfig = {
  pending_review: {
    icon: Clock,
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Your campaign is waiting for admin review'
  },
  under_review: {
    icon: Eye,
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-800',
    description: 'Our team is currently reviewing your campaign'
  },
  approved: {
    icon: CheckCircle,
    label: 'Approved',
    color: 'bg-green-100 text-green-800',
    description: 'Campaign approved! Creators can now see and accept invitations'
  },
  rejected: {
    icon: XCircle,
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    description: 'Campaign needs changes before approval'
  },
  needs_revision: {
    icon: AlertTriangle,
    label: 'Needs Revision',
    color: 'bg-orange-100 text-orange-800',
    description: 'Please make the requested changes and resubmit'
  }
};

export default function CampaignStatus() {
  const { brandProfile } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('all');

  const { data: campaigns = [], isLoading, refetch } = useQuery({
    queryKey: ['brand-campaign-status'],
    queryFn: async (): Promise<CampaignStatus[]> => {
      if (!brandProfile?.user_id) return [];

      const { data, error } = await supabase
        .from('projects_new')
        .select(`
          *,
          campaign_reviews (
            id,
            human_decision,
            review_notes,
            reviewed_at
          )
        `)
        .eq('brand_id', brandProfile.user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!brandProfile?.user_id,
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    return campaign.review_status === activeTab;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return campaigns.length;
    return campaigns.filter(c => c.review_status === status).length;
  };

  const CampaignCard = ({ campaign }: { campaign: CampaignStatus }) => {
    const config = statusConfig[campaign.review_status as keyof typeof statusConfig];
    const IconComponent = config?.icon || Clock;
    const latestReview = campaign.campaign_reviews?.[0];

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{campaign.name}</CardTitle>
              <CardDescription>
                {campaign.campaign_type} • {campaign.currency} {campaign.budget?.toLocaleString()}
              </CardDescription>
            </div>
            <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
              <IconComponent className="h-3 w-3 mr-1" />
              {config?.label || campaign.review_status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {config?.description || 'Status unknown'}
          </p>

          {latestReview?.review_notes && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Review Notes:</h4>
              <p className="text-sm text-muted-foreground">{latestReview.review_notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Submitted: {new Date(campaign.created_at).toLocaleDateString()}</span>
            {latestReview?.reviewed_at && (
              <span>Reviewed: {new Date(latestReview.reviewed_at).toLocaleDateString()}</span>
            )}
          </div>

          {campaign.review_status === 'rejected' || campaign.review_status === 'needs_revision' ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Edit Campaign
              </Button>
              <Button size="sm" className="flex-1">
                Resubmit
              </Button>
            </div>
          ) : campaign.review_status === 'approved' ? (
            <Button variant="outline" size="sm" className="w-full">
              View Campaign
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Campaign Status</h1>
            <p className="text-muted-foreground mt-1">
              Track the approval status of your submitted campaigns
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="ml-1">
                {getTabCount('all')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending_review" className="gap-2">
              Pending
              <Badge variant="secondary" className="ml-1">
                {getTabCount('pending_review')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="under_review" className="gap-2">
              Reviewing
              <Badge variant="secondary" className="ml-1">
                {getTabCount('under_review')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              Approved
              <Badge variant="secondary" className="ml-1">
                {getTabCount('approved')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="needs_revision" className="gap-2">
              Revision
              <Badge variant="secondary" className="ml-1">
                {getTabCount('needs_revision')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected
              <Badge variant="secondary" className="ml-1">
                {getTabCount('rejected')}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all' 
                      ? "You haven't submitted any campaigns yet."
                      : `No campaigns with ${activeTab.replace('_', ' ')} status.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
}
