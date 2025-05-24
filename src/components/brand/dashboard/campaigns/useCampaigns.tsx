
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { CampaignRow } from './CampaignRow';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';

export function useCampaigns() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      try {
        // Get the session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`);
        }
        
        const accessToken = sessionData.session?.access_token;

        if (!accessToken) {
          toast.error("Authentication error. Please sign in again.");
          return [];
        }

        // Using direct Supabase query
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
        return campaignRows;
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        toast.error("Failed to load campaigns");
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 30000,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('dashboard-campaigns-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `brand_id=eq.${user.id}`
      }, (payload) => {
        console.log('Dashboard campaign change detected:', payload);
        // Invalidate all related queries
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        queryClient.invalidateQueries({ queryKey: ['projects', user.id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const fetchData = () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  };

  return {
    data,
    loading,
    error: error?.message || null,
    fetchData,
  };
}
