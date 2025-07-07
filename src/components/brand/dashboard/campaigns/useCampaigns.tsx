
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
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
  const { user } = useUnifiedAuth();

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

      // Fetch from both tables in parallel
      const [newProjectsResult, legacyProjectsResult] = await Promise.allSettled([
        supabase
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
          .order('created_at', { ascending: false }),
        supabase
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
          .order('created_at', { ascending: false })
      ]);

      let allCampaigns: Campaign[] = [];

      // Process new projects data
      if (newProjectsResult.status === 'fulfilled' && newProjectsResult.value.data) {
        console.log('✅ useCampaigns - Found', newProjectsResult.value.data.length, 'campaigns in projects_new');
        
        const transformedNewCampaigns: Campaign[] = newProjectsResult.value.data.map(project => ({
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
      } else if (newProjectsResult.status === 'rejected') {
        console.error('❌ useCampaigns - Error fetching from projects_new:', newProjectsResult.reason);
      }

      // Process legacy projects data
      if (legacyProjectsResult.status === 'fulfilled' && legacyProjectsResult.value.data) {
        console.log('✅ useCampaigns - Found', legacyProjectsResult.value.data.length, 'campaigns in legacy projects');
        const transformedLegacyCampaigns: Campaign[] = legacyProjectsResult.value.data.map(project => ({
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
      } else if (legacyProjectsResult.status === 'rejected') {
        console.error('❌ useCampaigns - Error fetching from legacy projects:', legacyProjectsResult.reason);
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
        newTableCampaigns: newProjectsResult.status === 'fulfilled' ? newProjectsResult.value.data?.length || 0 : 0,
        legacyTableCampaigns: legacyProjectsResult.status === 'fulfilled' ? legacyProjectsResult.value.data?.length || 0 : 0,
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
      setCampaigns([]);
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
