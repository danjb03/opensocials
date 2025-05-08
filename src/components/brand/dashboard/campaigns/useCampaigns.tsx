
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { CampaignRow } from './CampaignRow';

export function useCampaigns() {
  const [data, setData] = useState<CampaignRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        toast.error("Authentication error. Please sign in again.");
        return;
      }

      // Using direct Supabase query instead of Edge Function
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('brand_id', sessionData.session?.user.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error("Projects query error:", projectsError);
        throw new Error(`Failed to fetch projects: ${projectsError.message}`);
      }

      // Transform the data to match the expected format
      const campaignRows: CampaignRow[] = projectsData.map(project => ({
        project_id: project.id,
        project_name: project.name,
        project_status: project.status || 'draft',
        start_date: project.start_date,
        end_date: project.end_date,
        budget: project.budget || 0,
        currency: project.currency || 'USD',
        deal_id: null,
        deal_status: null,
        deal_value: null,
        creator_name: null,
        avatar_url: null,
        engagement_rate: null,
        primary_platform: null
      }));

      console.log("Campaigns fetched successfully:", campaignRows);
      setData(campaignRows);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      setError(error.message);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
  };
}
