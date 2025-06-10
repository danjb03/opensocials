
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ToastManager } from '@/components/ui/toast-manager';
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

      let query = supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          start_date,
          end_date,
          budget,
          currency,
          brand_id,
          creator_deals!inner (
            id,
            creator_id,
            deal_value,
            status,
            creator_profiles!inner (
              first_name,
              last_name,
              avatar_url,
              engagement_rate,
              primary_platform
            )
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.dateRange) {
        query = query
          .gte('start_date', filters.dateRange.start.toISOString())
          .lte('end_date', filters.dateRange.end.toISOString());
      }

      const { data, error: queryError } = await query
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      // Transform data to match Campaign interface
      const transformedCampaigns: Campaign[] = (data || []).map(project => {
        // Get the first creator deal if available
        const firstDeal = Array.isArray(project.creator_deals) && project.creator_deals.length > 0 
          ? project.creator_deals[0] 
          : null;

        const creatorProfile = firstDeal?.creator_profiles;

        return {
          id: project.id,
          name: project.name,
          status: project.status as 'draft' | 'active' | 'completed' | 'paused' || 'draft',
          budget: project.budget || 0,
          startDate: project.start_date || '',
          endDate: project.end_date || '',
          creators: Array.isArray(project.creator_deals) ? project.creator_deals.length : 0,
          reach: 50000, // Mock data
          engagement: 4.2, // Mock data
          platform: creatorProfile?.primary_platform || 'Multiple'
        };
      });

      setCampaigns(transformedCampaigns);
      
      if (transformedCampaigns.length === 0 && !filters.search && !filters.status) {
        console.log('No campaigns found - this might be expected for new users');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(errorMessage);
      console.error('Error fetching campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleErrorDismiss = useCallback(() => {
    setError(null);
  }, []);

  return {
    campaigns,
    isLoading,
    error,
    refetch: fetchCampaigns,
    filters,
    setFilters,
  };
}

// Export ToastManager component for error handling
export { ToastManager };
