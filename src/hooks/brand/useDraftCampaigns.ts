import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

export const useDraftCampaigns = () => {
  const { user } = useUnifiedAuth();

  const { data: draftCampaigns = [], isLoading, error, refetch } = useQuery({
    queryKey: ['brand-draft-campaigns', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        console.log('🔍 Fetching draft campaigns for user:', user.id);
        
        // Fetch only draft campaigns from both tables
        const [{ data: newDrafts }, { data: legacyDrafts }] = await Promise.all([
          supabase
            .from('projects_new')
            .select('*')
            .eq('brand_id', user.id)
            .eq('review_status', 'draft')
            .order('created_at', { ascending: false }),
          supabase
            .from('projects')
            .select('*')
            .eq('brand_id', user.id)
            .eq('status', 'draft')
            .order('created_at', { ascending: false })
        ]);

        console.log('📊 Draft campaigns fetched:', {
          newDrafts: newDrafts?.length || 0,
          legacyDrafts: legacyDrafts?.length || 0
        });

        // Transform to unified format
        const allDrafts = [
          ...(newDrafts || []).map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            description: project.description,
            created_at: project.created_at,
            updated_at: project.updated_at,
            current_step: project.current_step || 1,
            campaign_type: project.campaign_type,
            budget: project.budget || 0,
            currency: project.currency || 'USD',
            platforms: project.platforms || [],
            status: 'draft',
            review_status: 'draft'
          })),
          ...(legacyDrafts || []).map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            description: project.description,
            created_at: project.created_at,
            updated_at: project.created_at, // Legacy doesn't have updated_at
            current_step: 1, // Default step for legacy
            campaign_type: project.campaign_type,
            budget: project.budget || 0,
            currency: project.currency || 'USD',
            platforms: project.platforms || [],
            status: 'draft',
            review_status: 'draft'
          }))
        ];

        return allDrafts;
      } catch (error) {
        console.error('Error fetching draft campaigns:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  return {
    draftCampaigns,
    isLoading,
    error,
    refetch
  };
};
