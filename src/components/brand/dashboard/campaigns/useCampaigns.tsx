
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
}

export const useCampaigns = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
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
          description: p.description
        })),
        ...(legacyProjects || []).map(p => ({
          id: p.id,
          name: p.name || 'Untitled Campaign',
          status: p.status || 'draft',
          budget: p.budget || 0,
          currency: p.currency || 'USD',
          created_at: p.created_at,
          description: p.description
        }))
      ];

      return campaigns;
    },
    enabled: !!user?.id
  });
};
