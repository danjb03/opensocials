
import React, { useState } from 'react';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvitationsList } from '@/components/creator/invitations/InvitationsList';
import PendingDeals from '@/components/deals/PendingDeals';
import PastDeals from '@/components/deals/PastDeals';
import { MailPlus, Handshake, History } from 'lucide-react';
import { useCreatorDealsSecure, useCreatorDealStats } from '@/hooks/useCreatorDealsSecure';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PendingDeal {
  id: string;
  project_id: string;
  deal_value: number;
  status: string;
  invited_at: string;
  project?: {
    name: string;
    description?: string;
    campaign_type: string;
    start_date?: string;
    end_date?: string;
    brand_profile?: {
      company_name: string;
      logo_url?: string;
    };
  };
}

interface PastDeal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  profiles: {
    company_name: string;
    logo_url?: string;
  };
}

const CreatorDeals = () => {
  const [activeTab, setActiveTab] = useState<'invitations' | 'pending' | 'past'>('invitations');
  const { data: deals = [], isLoading, error } = useCreatorDealsSecure();
  const stats = useCreatorDealStats();

  console.log('CreatorDeals: deals data:', deals, 'stats:', stats);

  if (error) {
    console.error('Error in CreatorDeals:', error);
  }

  // Transform CreatorDealSecure to PendingDeal format for pending deals
  const transformToPendingDeals = (creatorDeals: typeof deals): PendingDeal[] => {
    return creatorDeals.map(deal => ({
      id: deal.id,
      project_id: deal.project_id,
      deal_value: deal.deal_value,
      status: deal.status,
      invited_at: deal.invited_at,
      project: deal.project ? {
        name: deal.project.name,
        description: deal.project.description,
        campaign_type: deal.project.campaign_type,
        start_date: deal.project.start_date,
        end_date: deal.project.end_date,
        brand_profile: deal.project.brand_profile
      } : undefined
    }));
  };

  // Transform CreatorDealSecure to PastDeal format for past deals
  const transformToPastDeals = (creatorDeals: typeof deals): PastDeal[] => {
    return creatorDeals.map(deal => ({
      id: deal.id,
      title: deal.project?.name || 'Untitled Campaign',
      description: deal.project?.description || null,
      value: deal.deal_value,
      status: deal.status,
      feedback: deal.creator_feedback || null,
      creator_id: deal.creator_id,
      brand_id: deal.project_id, // Using project_id as brand_id for compatibility
      created_at: deal.created_at,
      updated_at: deal.updated_at,
      profiles: {
        company_name: deal.project?.brand_profile?.company_name || 'Unknown Brand',
        logo_url: deal.project?.brand_profile?.logo_url
      }
    }));
  };

  const transformedPendingDeals = transformToPendingDeals(stats.pendingDeals);
  const transformedAcceptedDeals = transformToPendingDeals(stats.acceptedDeals);
  const transformedCompletedDeals = transformToPastDeals(stats.completedDealsList);

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Paid Opportunities</h1>
          <p className="text-muted-foreground">Quick responses lead to quicker payouts. Monitor paid brand deals from invite to final payout.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pipelineValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDeals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedDeals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <MailPlus className="h-4 w-4" />
              Invitations ({transformedPendingDeals.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Active Deals ({transformedAcceptedDeals.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Past Deals ({transformedCompletedDeals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invitations">
            {isLoading ? (
              <div className="flex justify-center p-8">Loading invitations...</div>
            ) : (
              <PendingDeals deals={transformedPendingDeals} />
            )}
          </TabsContent>

          <TabsContent value="pending">
            {isLoading ? (
              <div className="flex justify-center p-8">Loading active deals...</div>
            ) : (
              <PendingDeals deals={transformedAcceptedDeals} />
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoading ? (
              <div className="flex justify-center p-8">Loading past deals...</div>
            ) : (
              <PastDeals deals={transformedCompletedDeals} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDeals;
