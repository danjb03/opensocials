
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReviewStats } from '@/components/admin/campaign-review/ReviewStats';
import { CampaignReviewTable } from '@/components/admin/campaign-review/CampaignReviewTable';
import { CampaignReviewModal } from '@/components/admin/campaign-review/CampaignReviewModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Campaign {
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
}

const CampaignReview = () => {
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: campaigns = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-campaigns', statusFilter],
    queryFn: async (): Promise<Campaign[]> => {
      console.log('🔍 Fetching campaigns for review with status:', statusFilter);
      
      try {
        // Use a more explicit join approach to avoid foreign key relationship issues
        const { data, error } = await supabase
          .from('projects_new')
          .select(`
            id,
            name,
            brand_id,
            campaign_type,
            budget,
            currency,
            status,
            review_status,
            review_priority,
            created_at
          `)
          .eq('review_status', statusFilter)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Database query error:', error);
          throw error;
        }

        // Fetch brand profiles separately to avoid join issues
        const campaignsWithBrands = await Promise.all(
          (data || []).map(async (campaign) => {
            const { data: brandProfile } = await supabase
              .from('brand_profiles')
              .select('company_name')
              .eq('user_id', campaign.brand_id)
              .single();

            return {
              ...campaign,
              brand_profiles: brandProfile ? { company_name: brandProfile.company_name } : null
            };
          })
        );

        console.log('✅ Campaigns fetched:', campaignsWithBrands.length);
        return campaignsWithBrands;
      } catch (error) {
        console.error('❌ Error fetching campaigns:', error);
        throw error;
      }
    },
  });

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    setModalOpen(true);
  };

  const handleReviewComplete = () => {
    setModalOpen(false);
    setSelectedCampaign(null);
    refetch();
  };

  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Review</h1>
          <p className="text-muted-foreground">
            AI-powered campaign analysis and approval workflow
          </p>
        </div>
      </div>

      <ReviewStats />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaign Queue</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="needs_revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <CampaignReviewTable
            campaigns={campaigns}
            isLoading={isLoading}
            onSelectCampaign={handleSelectCampaign}
            selectedCampaign={selectedCampaign}
          />
        </CardContent>
      </Card>

      {selectedCampaignData && (
        <CampaignReviewModal
          campaign={selectedCampaignData}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
};

export default CampaignReview;
