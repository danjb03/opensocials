
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCampaignFilters } from '@/hooks/creator/useCampaignFilters';
import CampaignTabs from '@/components/creator/campaigns/CampaignTabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: string | null;
  budget: number | null;
  currency: string | null;
  campaign_type: string;
  brand_id: string | null;
}

const CreatorCampaigns = () => {
  const { user, role } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');

  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['creator-campaigns', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('campaign_type', 'invite')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedCampaigns = (data || []).map(campaign => ({
          id: campaign.id,
          name: campaign.name || 'Untitled Campaign',
          description: campaign.description,
          start_date: campaign.start_date || new Date().toISOString(),
          end_date: campaign.end_date || new Date().toISOString(),
          status: campaign.status,
          budget: campaign.budget,
          currency: campaign.currency || 'USD',
          campaign_type: campaign.campaign_type || 'invite',
          brand_id: campaign.brand_id,
        }));
        
        return formattedCampaigns;
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to load campaigns');
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const { activeCampaigns, upcomingCampaigns, completedCampaigns } = useCampaignFilters(campaigns);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <p className="text-red-400 text-lg">Error loading campaigns</p>
              <p className="text-sm text-muted-foreground">Please refresh the page to try again</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'super_admin') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
              My Campaigns
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              You are viewing the creator campaigns page as a super admin.
            </p>
          </div>
          
          <CampaignTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeCampaigns={[]}
            upcomingCampaigns={[]}
            completedCampaigns={[]}
            isLoading={false}
          />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
              My Campaigns
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Manage your active campaigns and track your content delivery.
            </p>
          </div>

          <CampaignTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeCampaigns={activeCampaigns}
            upcomingCampaigns={upcomingCampaigns}
            completedCampaigns={completedCampaigns}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CreatorCampaigns;
