
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignList from '@/components/creator/campaigns/CampaignList';
import EmptyCampaigns from '@/components/creator/campaigns/EmptyCampaigns';
import { toast } from 'sonner';
import { Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';

// Campaign types for the different tabs
const CAMPAIGN_TYPES = {
  active: 'Active',
  upcoming: 'Upcoming',
  completed: 'Completed',
};

const CreatorCampaigns = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');

  // Fetch campaigns where the creator is assigned
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['creator-campaigns', user?.id],
    queryFn: async () => {
      try {
        // Get deals first to identify campaigns the creator is involved in
        const { data: deals, error: dealsError } = await supabase
          .from('deals')
          .select('*, projects:brand_id(id, name, start_date, end_date, status, campaign_type, platforms, content_requirements, brand_id)')
          .eq('creator_id', user?.id)
          .eq('status', 'accepted');
        
        if (dealsError) throw dealsError;

        // Map and format campaign data
        const formattedCampaigns = deals.map((deal: any) => ({
          id: deal.projects?.id || deal.id,
          title: deal.projects?.name || deal.title,
          description: deal.description || '',
          startDate: deal.projects?.start_date || new Date().toISOString(),
          endDate: deal.projects?.end_date || new Date().toISOString(),
          status: deal.projects?.status || 'in_progress',
          contentRequirements: deal.projects?.content_requirements || {},
          brandId: deal.projects?.brand_id || deal.brand_id,
          platforms: deal.projects?.platforms || [],
          dealId: deal.id,
          value: deal.value || 0,
          contentUploaded: false, // Will be updated with content check
        }));

        // Fetch brand info for each campaign
        for (const campaign of formattedCampaigns) {
          const { data: brandData } = await supabase
            .from('profiles')
            .select('company_name, logo_url')
            .eq('id', campaign.brandId)
            .single();
          
          campaign.brandName = brandData?.company_name || 'Unknown Brand';
          campaign.brandLogo = brandData?.logo_url || null;
          
          // Check if creator has uploaded content for this campaign
          const { data: contentData } = await supabase
            .from('campaign_content')
            .select('id')
            .eq('campaign_id', campaign.id)
            .eq('creator_id', user?.id)
            .limit(1);
          
          campaign.contentUploaded = contentData && contentData.length > 0;
        }

        return formattedCampaigns;
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to load campaigns');
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    const today = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    if (activeTab === 'active') {
      return startDate <= today && endDate >= today;
    } else if (activeTab === 'upcoming') {
      return startDate > today;
    } else {
      return endDate < today || campaign.status === 'completed';
    }
  });

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Your Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage your active brand partnerships and content deliverables</p>
        </header>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Active</span>
              <span className="bg-primary/10 text-primary rounded-full text-xs px-2 py-0.5">
                {campaigns.filter(c => {
                  const today = new Date();
                  const startDate = new Date(c.startDate);
                  const endDate = new Date(c.endDate);
                  return startDate <= today && endDate >= today;
                }).length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Upcoming</span>
              <span className="bg-primary/10 text-primary rounded-full text-xs px-2 py-0.5">
                {campaigns.filter(c => new Date(c.startDate) > new Date()).length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
              <span className="bg-primary/10 text-primary rounded-full text-xs px-2 py-0.5">
                {campaigns.filter(c => {
                  const today = new Date();
                  const endDate = new Date(c.endDate);
                  return endDate < today || c.status === 'completed';
                }).length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(CAMPAIGN_TYPES).map(([key, label]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredCampaigns.length > 0 ? (
                <CampaignList campaigns={filteredCampaigns} />
              ) : (
                <EmptyCampaigns type={key as 'active' | 'upcoming' | 'completed'} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </CreatorLayout>
  );
};

export default CreatorCampaigns;
