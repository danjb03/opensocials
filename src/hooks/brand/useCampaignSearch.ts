import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

export interface CampaignSearchResult {
  id: string;
  name: string;
  status: string;
  review_status?: string;
  created_at: string;
  table_source: 'projects_new' | 'projects' | 'project_drafts';
  description?: string;
  budget?: number;
  currency?: string;
}

export const useCampaignSearch = (searchTerm?: string) => {
  const { user } = useUnifiedAuth();

  const { data: allCampaigns = [], isLoading, error, refetch } = useQuery({
    queryKey: ['brand-all-campaigns-search', user?.id, searchTerm],
    queryFn: async (): Promise<CampaignSearchResult[]> => {
      if (!user?.id) return [];

      try {
        console.log('🔍 Searching all campaigns for user:', user.id, 'term:', searchTerm);
        
        // Search across all campaign tables
        const [
          { data: newProjects },
          { data: legacyProjects },
          { data: drafts }
        ] = await Promise.all([
          supabase
            .from('projects_new')
            .select('*')
            .eq('brand_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('projects')
            .select('*')
            .eq('brand_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('project_drafts')
            .select('*')
            .eq('brand_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        const results: CampaignSearchResult[] = [];

        // Process new projects
        if (newProjects) {
          results.push(...newProjects.map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            status: project.status || 'draft',
            review_status: project.review_status,
            created_at: project.created_at,
            table_source: 'projects_new' as const,
            description: project.description,
            budget: project.budget,
            currency: project.currency
          })));
        }

        // Process legacy projects
        if (legacyProjects) {
          results.push(...legacyProjects.map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            status: project.status || 'draft',
            created_at: project.created_at,
            table_source: 'projects' as const,
            description: project.description,
            budget: project.budget,
            currency: project.currency
          })));
        }

        // Process draft projects with proper type casting
        if (drafts) {
          results.push(...drafts.map(draft => {
            // Safely cast draft_data to any for property access
            const draftData = draft.draft_data as any;
            
            return {
              id: draft.id,
              name: draftData?.name || 'Untitled Draft',
              status: 'draft',
              created_at: draft.created_at,
              table_source: 'project_drafts' as const,
              description: draftData?.description,
              budget: draftData?.total_budget,
              currency: draftData?.currency || 'USD'
            };
          }));
        }

        // Filter by search term if provided
        let filteredResults = results;
        if (searchTerm && searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filteredResults = results.filter(campaign => 
            campaign.name.toLowerCase().includes(term) ||
            campaign.description?.toLowerCase().includes(term) ||
            campaign.status.toLowerCase().includes(term)
          );
        }

        console.log('📊 Campaign search results:', {
          total: results.length,
          filtered: filteredResults.length,
          searchTerm,
          sources: {
            projects_new: newProjects?.length || 0,
            projects: legacyProjects?.length || 0,
            project_drafts: drafts?.length || 0
          }
        });

        return filteredResults;
      } catch (error) {
        console.error('Error searching campaigns:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  return {
    allCampaigns,
    isLoading,
    error,
    refetch
  };
};
