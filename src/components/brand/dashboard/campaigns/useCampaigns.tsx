
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
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
  const { user } = useAuth();

  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        console.log('🔍 useCampaigns - No user ID available');
        setCampaigns([]);
        return;
      }

      console.log('🔍 useCampaigns - Fetching campaigns for user ID:', user.id);

      // First, try to fetch from projects_new table (new campaign wizard campaigns)
      console.log('📥 useCampaigns - Fetching from projects_new table...');
      const { data: newProjectsData, error: newProjectsError } = await supabase
        .from('projects_new')
        .select(`
          id,
          name,
          status,
          start_date,
          end_date,
          budget,
          created_at,
          campaign_type,
          platforms,
          brand_id
        `)
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false });

      let allCampaigns: Campaign[] = [];

      // Process new projects data
      if (!newProjectsError && newProjectsData) {
        console.log('✅ useCampaigns - Found', newProjectsData.length, 'campaigns in projects_new');
        console.log('📊 useCampaigns - Projects_new campaigns:', newProjectsData.map(p => ({
          id: p.id,
          name: p.name,
          brand_id: p.brand_id,
          status: p.status
        })));
        
        const transformedNewCampaigns: Campaign[] = newProjectsData.map(project => ({
          id: project.id,
          name: project.name || 'Untitled Campaign',
          status: (project.status as 'draft' | 'active' | 'completed' | 'paused') || 'draft',
          budget: project.budget || 0,
          startDate: project.start_date || '',
          endDate: project.end_date || '',
          creators: 0, // Will be populated from deals if available
          reach: 25000, // Mock data for now
          engagement: 3.8, // Mock data for now
          platform: Array.isArray(project.platforms) && project.platforms.length > 0 
            ? project.platforms[0] 
            : 'Multiple'
        }));
        allCampaigns = [...transformedNewCampaigns];
      } else if (newProjectsError) {
        console.error('❌ useCampaigns - Error fetching from projects_new:', newProjectsError);
      }

      // Also try to fetch from legacy projects table for backwards compatibility
      console.log('📥 useCampaigns - Fetching from legacy projects table...');
      const { data: legacyProjectsData, error: legacyProjectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          start_date,
          end_date,
          budget,
          currency,
          created_at,
          campaign_type,
          platforms,
          brand_id
        `)
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false });

      // Process legacy projects data
      if (!legacyProjectsError && legacyProjectsData) {
        console.log('✅ useCampaigns - Found', legacyProjectsData.length, 'campaigns in legacy projects');
        const transformedLegacyCampaigns: Campaign[] = legacyProjectsData.map(project => ({
          id: project.id,
          name: project.name || 'Untitled Campaign',
          status: (project.status as 'draft' | 'active' | 'completed' | 'paused') || 'draft',
          budget: project.budget || 0,
          startDate: project.start_date || '',
          endDate: project.end_date || '',
          creators: 0, // Will be populated from deals if available
          reach: 35000, // Mock data for now
          engagement: 4.1, // Mock data for now
          platform: Array.isArray(project.platforms) && project.platforms.length > 0 
            ? project.platforms[0] 
            : 'Multiple'
        }));
        
        // Merge with new campaigns, avoiding duplicates
        const existingIds = new Set(allCampaigns.map(c => c.id));
        const uniqueLegacyCampaigns = transformedLegacyCampaigns.filter(c => !existingIds.has(c.id));
        allCampaigns = [...allCampaigns, ...uniqueLegacyCampaigns];
      } else if (legacyProjectsError) {
        console.error('❌ useCampaigns - Error fetching from legacy projects:', legacyProjectsError);
      }

      // Apply filters
      let filteredData = allCampaigns;

      if (filters.search) {
        filteredData = filteredData.filter(campaign => 
          campaign.name?.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.status) {
        filteredData = filteredData.filter(campaign => campaign.status === filters.status);
      }

      if (filters.dateRange) {
        filteredData = filteredData.filter(campaign => {
          const startDate = new Date(campaign.startDate || '');
          return startDate >= filters.dateRange!.start && startDate <= filters.dateRange!.end;
        });
      }

      setCampaigns(filteredData);
      
      console.log('📊 useCampaigns - Final summary:', {
        totalCampaigns: filteredData.length,
        newTableCampaigns: newProjectsData?.length || 0,
        legacyTableCampaigns: legacyProjectsData?.length || 0,
        userId: user.id,
        campaignsByStatus: filteredData.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      console.error('❌ useCampaigns - Error:', err);
      setError(errorMessage);
      
      // Don't show toast for expected empty states
      if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        setCampaigns([]); // Set empty array for new users
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, user?.id]);

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
