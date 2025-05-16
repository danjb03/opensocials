
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Instagram, Youtube } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { toast } from 'sonner';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  contentRequirements: Record<string, any>;
  brandId: string;
  platforms: string[];
  dealId: string;
  value: number;
  deadline: string;
  brandName: string;
  brandLogo: string | null;
  uploads: any[];
}

export const useCampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'tiktok':
        return <TikTokIcon className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      try {
        if (!user?.id) throw new Error('User not authenticated');
        
        // Get deals first to identify campaign the creator is involved in
        const { data: deals, error: dealsError } = await supabase
          .from('deals')
          .select('*')
          .eq('creator_id', user.id)
          .eq('status', 'accepted');
        
        if (dealsError) throw dealsError;
        
        if (!deals || deals.length === 0) {
          throw new Error('No deals found');
        }

        // Find the relevant deal
        const deal = deals.find(d => d.id === id);
        
        if (!deal) {
          throw new Error('Campaign not found');
        }

        // Now fetch the project associated with this deal
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        // Initialize campaign with combined data
        const campaignData: Campaign = {
          id: (project?.id || deal.id || ''),
          title: (project?.name || deal.title || 'Untitled Campaign'),
          description: (project?.description || deal.description || ''),
          startDate: (project?.start_date || new Date().toISOString()),
          endDate: (project?.end_date || new Date().toISOString()),
          status: (project?.status || 'in_progress'),
          contentRequirements: {},
          brandId: (project?.brand_id || deal.brand_id || ''),
          platforms: [],
          dealId: deal.id,
          value: deal.value || 0,
          deadline: (project?.submission_deadline || project?.end_date || new Date().toISOString()),
          brandName: '',
          brandLogo: null,
          uploads: []
        };
        
        // Safe assign content_requirements if it's an object
        if (project?.content_requirements && 
            typeof project.content_requirements === 'object' && 
            !Array.isArray(project.content_requirements)) {
          campaignData.contentRequirements = project.content_requirements as Record<string, any>;
        }
        
        // Safe assign platforms if it's an array
        if (project?.platforms && Array.isArray(project.platforms)) {
          campaignData.platforms = project.platforms;
        }

        // Get brand info if brandId is available
        if (campaignData.brandId) {
          const { data: brandData } = await supabase
            .from('profiles')
            .select('company_name, logo_url')
            .eq('id', campaignData.brandId)
            .single();
          
          if (brandData) {
            campaignData.brandName = brandData?.company_name || 'Unknown Brand';
            campaignData.brandLogo = brandData?.logo_url;
          }
        }
        
        // Get upload history
        if (id) {
          const { data: contentData } = await supabase
            .from('campaign_content')
            .select('*')
            .eq('campaign_id', campaignData.id)
            .eq('creator_id', user.id);
          
          campaignData.uploads = contentData || [];
        }
        
        return campaignData;
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast.error('Failed to load campaign details');
        return null;
      }
    },
    enabled: !!id && !!user?.id,
  });

  return {
    id,
    campaign,
    isLoading,
    activeTab,
    setActiveTab,
    getPlatformIcon
  };
};
