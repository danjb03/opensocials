
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCampaignFilters } from '@/hooks/creator/useCampaignFilters';
import CreatorLayout from '@/components/layouts/CreatorLayout';
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

  // Fetch campaigns where the creator is assigned
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

        // Format the campaigns to include only necessary data
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
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-400 mb-2">Error loading campaigns</p>
              <p className="text-sm text-muted-foreground">Please refresh the page to try again</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  // Super admin preview mode
  if (role === 'super_admin') {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">My Campaigns</h1>
            <p className="text-muted-foreground">You are viewing the creator campaigns page as a super admin.</p>
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
      </CreatorLayout>
    );
  }

  return (
    <ErrorBoundary>
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">My Campaigns</h1>
            <p className="text-muted-foreground">Manage your active campaigns and track your content delivery.</p>
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
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default CreatorCampaigns;
