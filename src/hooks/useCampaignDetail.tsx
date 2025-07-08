import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface CampaignDetails {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  campaign_type: string;
  platforms: string[];
  brand_id: string;
  created_at: string;
}

interface UseCampaignDetailReturn {
  campaign: CampaignDetails | null;
  isLoading: boolean;
  error: string | null;
}

export function useCampaignDetail(campaignId: string | undefined): UseCampaignDetailReturn {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUnifiedAuth();

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) {
        console.warn('No campaign ID provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('projects_new')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (error) {
          console.error('Error fetching campaign:', error);
          setError(error.message);
          toast({
            title: 'Error fetching campaign',
            description: error.message,
            variant: 'destructive',
          });
        }

        if (data) {
          setCampaign({
            id: data.id,
            name: data.name || 'Untitled Campaign',
            status: data.status || 'draft',
            startDate: data.start_date || '',
            endDate: data.end_date || '',
            budget: data.budget || 0,
            campaign_type: data.campaign_type || '',
            platforms: data.platforms || [],
            brand_id: data.brand_id || '',
            created_at: data.created_at || '',
          });
        }
      } catch (err) {
        console.error('Unexpected error fetching campaign:', err);
        setError('Failed to fetch campaign');
        toast({
          title: 'Unexpected error',
          description: 'Failed to fetch campaign',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, toast]);

  return { campaign, isLoading, error };
}
