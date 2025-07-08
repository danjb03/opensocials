
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCampaignFilters } from '@/hooks/creator/useCampaignFilters';
import CampaignTabs from '@/components/creator/campaigns/CampaignTabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from 'sonner';
import { TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

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
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-medium text-foreground">Error loading campaigns</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                We encountered an issue while loading your campaigns. Please refresh the page to try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'super_admin') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-light text-foreground tracking-tight">
                  My Campaigns
                </h1>
                <p className="text-lg text-muted-foreground font-light mt-1">
                  Super admin preview mode - viewing creator campaigns interface
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card/30 backdrop-blur border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-light text-foreground">0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card/30 backdrop-blur border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-light text-foreground">0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card/30 backdrop-blur border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-light text-foreground">0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
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
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-light text-foreground tracking-tight">
                  My Campaigns
                </h1>
                <p className="text-lg text-muted-foreground font-light mt-1">
                  Manage your active campaigns and track your content delivery progress
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card/30 backdrop-blur border border-border rounded-xl p-6 hover:bg-card/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-light text-foreground">{activeCampaigns.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Currently running</p>
              </div>
              
              <div className="bg-card/30 backdrop-blur border border-border rounded-xl p-6 hover:bg-card/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-light text-foreground">{upcomingCampaigns.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Starting soon</p>
              </div>
              
              <div className="bg-card/30 backdrop-blur border border-border rounded-xl p-6 hover:bg-card/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-light text-foreground">{completedCampaigns.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Successfully finished</p>
              </div>
            </div>
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
