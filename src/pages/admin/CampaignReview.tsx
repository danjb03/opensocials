
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bot, Filter, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import { CampaignReviewTable } from '@/components/admin/campaign-review/CampaignReviewTable';
import { ReviewStats } from '@/components/admin/campaign-review/ReviewStats';
import { AIReviewPanel } from '@/components/admin/campaign-review/AIReviewPanel';
import { supabase } from '@/integrations/supabase/client';

interface CampaignForReview {
  id: string;
  name: string;
  brand_id: string;
  campaign_type: string;
  budget: number;
  currency: string;
  status: string;
  review_status: string;
  review_priority: string;
  created_at: string;
  brand_profiles?: {
    company_name: string;
  } | null;
  campaign_reviews?: {
    id: string;
    ai_decision: string;
    ai_score: number;
    human_decision: string;
    reviewed_at: string;
  }[];
}

export default function CampaignReview() {
  const { role } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  // Check admin access FIRST before any hooks
  if (role !== 'admin' && role !== 'super_admin') {
    return (
      <AdminCRMLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </AdminCRMLayout>
    );
  }

  const { data: campaigns = [], isLoading, refetch } = useQuery({
    queryKey: ['campaigns-for-review', activeTab, searchTerm],
    queryFn: async (): Promise<CampaignForReview[]> => {
      let query = supabase
        .from('projects_new')
        .select(`
          *,
          brand_profiles!inner (
            company_name
          ),
          campaign_reviews (
            id,
            ai_decision,
            ai_score,
            human_decision,
            reviewed_at
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by review status based on active tab
      switch (activeTab) {
        case 'pending':
          query = query.eq('review_status', 'pending_review');
          break;
        case 'under_review':
          query = query.eq('review_status', 'under_review');
          break;
        case 'approved':
          query = query.eq('review_status', 'approved');
          break;
        case 'rejected':
          query = query.eq('review_status', 'rejected');
          break;
        case 'needs_revision':
          query = query.eq('review_status', 'needs_revision');
          break;
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,campaign_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Database query error:', error);
        throw error;
      }
      
      // Transform the data to ensure proper typing and handle null brand_profiles
      return (data || []).map(campaign => {
        // Safely handle brand_profiles - it could be null, undefined, or an object
        let brandProfiles: { company_name: string } | null = null;
        
        if (campaign?.brand_profiles && 
            typeof campaign.brand_profiles === 'object' && 
            'company_name' in campaign.brand_profiles &&
            typeof campaign.brand_profiles.company_name === 'string') {
          brandProfiles = { company_name: campaign.brand_profiles.company_name };
        }

        return {
          ...campaign,
          brand_profiles: brandProfiles
        };
      }) as CampaignForReview[];
    },
    enabled: role === 'admin' || role === 'super_admin', // Only run query if user has admin access
  });

  const getTabCount = (status: string) => {
    return campaigns.filter(campaign => {
      switch (status) {
        case 'pending':
          return campaign.review_status === 'pending_review';
        case 'under_review':
          return campaign.review_status === 'under_review';
        case 'approved':
          return campaign.review_status === 'approved';
        case 'rejected':
          return campaign.review_status === 'rejected';
        case 'needs_revision':
          return campaign.review_status === 'needs_revision';
        default:
          return false;
      }
    }).length;
  };

  return (
    <AdminCRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-8 w-8" />
              AI Campaign Review System
            </h1>
            <p className="text-muted-foreground">
              AI-powered campaign analysis and approval workflow
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <ReviewStats />

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending" className="gap-2">
              Pending Review
              {getTabCount('pending') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getTabCount('pending')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="under_review" className="gap-2">
              Under Review
              {getTabCount('under_review') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getTabCount('under_review')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              Approved
              {getTabCount('approved') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getTabCount('approved')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected
              {getTabCount('rejected') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getTabCount('rejected')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="needs_revision" className="gap-2">
              Needs Revision
              {getTabCount('needs_revision') > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getTabCount('needs_revision')}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className={`grid gap-6 ${selectedCampaign ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <div className={selectedCampaign ? 'lg:col-span-2' : 'col-span-1'}>
              <TabsContent value={activeTab} className="space-y-6 mt-0">
                <CampaignReviewTable 
                  campaigns={campaigns}
                  isLoading={isLoading}
                  onSelectCampaign={setSelectedCampaign}
                  selectedCampaign={selectedCampaign}
                />
              </TabsContent>
            </div>

            {selectedCampaign && (
              <div className="lg:col-span-1">
                <AIReviewPanel 
                  campaignId={selectedCampaign}
                  onReviewComplete={() => refetch()}
                />
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </AdminCRMLayout>
  );
}
