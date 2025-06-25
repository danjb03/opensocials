
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  currency: string;
  created_at: string;
  description?: string;
  // Add missing properties to match CampaignRow expectations
  startDate?: string;
  endDate?: string;
  creators?: number;
  reach?: number;
  engagement?: number;
  conversion?: number;
}

export const useCampaigns = () => {
  const { user } = useUnifiedAuth();

  const query = useQuery({
    queryKey: ['brand-campaigns', user?.id],
    queryFn: async (): Promise<Campaign[]> => {
      if (!user?.id) return [];

      // Fetch from both tables
      const [{ data: newProjects }, { data: legacyProjects }] = await Promise.all([
        supabase
          .from('projects_new')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('projects')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      const campaigns: Campaign[] = [
        ...(newProjects || []).map(p => ({
          id: p.id,
          name: p.name || 'Untitled Campaign',
          status: p.status || 'draft',
          budget: p.budget || 0,
          currency: p.currency || 'USD',
          created_at: p.created_at,
          description: p.description,
          startDate: p.start_date,
          endDate: p.end_date,
          creators: 0,
          reach: 0,
          engagement: 0,
          conversion: 0
        })),
        ...(legacyProjects || []).map(p => ({
          id: p.id,
          name: p.name || 'Untitled Campaign',
          status: p.status || 'draft',
          budget: p.budget || 0,
          currency: p.currency || 'USD',
          created_at: p.created_at,
          description: p.description,
          startDate: p.start_date,
          endDate: p.end_date,
          creators: 0,
          reach: 0,
          engagement: 0,
          conversion: 0
        }))
      ];

      return campaigns;
    },
    enabled: !!user?.id
  });

  return {
    campaigns: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: async () => {
      await query.refetch();
    }
  };
};
