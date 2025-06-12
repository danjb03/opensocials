
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Campaign } from './CampaignRow';

interface CampaignFilters {
  search?: string;
  status?: string;
  dateRange?: { start: Date; end: Date };
}

interface UseCampaignsReturn {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: CampaignFilters;
  setFilters: (filters: CampaignFilters) => void;
}

export function useCampaigns(): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>({});
  const { toast } = useToast();

  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching campaigns...');

      // Try to fetch from projects_new first (new table structure)
      let { data: projectsData, error: projectsError } = await supabase
        .from('projects_new')
        .select(`
          id,
          name,
          status,
          start_date,
          end_date,
          budget,
          created_at,
          creator_deals (
            id,
            creator_id,
            deal_value,
            status,
            creator_profiles (
              first_name,
              last_name,
              avatar_url,
              primary_platform
            )
          )
        `)
        .order('created_at', { ascending: false });

      // If projects_new doesn't exist or has no data, try the old projects table
      if (projectsError || !projectsData || projectsData.length === 0) {
        console.log('Trying fallback to projects table');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('projects')
          .select(`
            id,
            name,
            status,
            start_date,
            end_date,
            budget,
            currency,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('Error fetching from projects table:', fallbackError);
          throw fallbackError;
        }

        // Transform fallback data
        const transformedCampaigns: Campaign[] = (fallbackData || []).map(project => ({
          id: project.id,
          name: project.name || 'Untitled Campaign',
          status: (project.status as 'draft' | 'active' | 'completed' | 'paused') || 'draft',
          budget: project.budget || 0,
          startDate: project.start_date || '',
          endDate: project.end_date || '',
          creators: 0, // No creator data in old table
          reach: 0,
          engagement: 0,
          platform: 'Multiple'
        }));

        setCampaigns(transformedCampaigns);
        console.log('Loaded campaigns from fallback:', transformedCampaigns.length);
        return;
      }

      // Apply filters to projects_new data
      let filteredData = projectsData;

      if (filters.search) {
        filteredData = filteredData.filter(project => 
          project.name?.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.status) {
        filteredData = filteredData.filter(project => project.status === filters.status);
      }

      if (filters.dateRange) {
        filteredData = filteredData.filter(project => {
          const startDate = new Date(project.start_date || '');
          return startDate >= filters.dateRange!.start && startDate <= filters.dateRange!.end;
        });
      }

      // Transform data to match Campaign interface
      const transformedCampaigns: Campaign[] = filteredData.map(project => {
        const deals = Array.isArray(project.creator_deals) ? project.creator_deals : [];
        const firstDeal = deals.length > 0 ? deals[0] : null;
        const creatorProfile = firstDeal?.creator_profiles;

        return {
          id: project.id,
          name: project.name || 'Untitled Campaign',
          status: (project.status as 'draft' | 'active' | 'completed' | 'paused') || 'draft',
          budget: project.budget || 0,
          startDate: project.start_date || '',
          endDate: project.end_date || '',
          creators: deals.length,
          reach: 50000, // Mock data for now
          engagement: 4.2, // Mock data for now
          platform: creatorProfile?.primary_platform || 'Multiple'
        };
      });

      setCampaigns(transformedCampaigns);
      console.log('Loaded campaigns:', transformedCampaigns.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      console.error('Error fetching campaigns:', err);
      setError(errorMessage);
      
      // Don't show toast for expected empty states
      if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        setCampaigns([]); // Set empty array for new users
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    isLoading,
    error,
    refetch: fetchCampaigns,
    filters,
    setFilters,
  };
}
