
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export interface BrandDashboardData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalCreators: number;
  totalSpent: number;
}

export const useBrandDashboard = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['brand-dashboard', user?.id],
    queryFn: async (): Promise<BrandDashboardData> => {
      if (!user?.id) {
        return {
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalCreators: 0,
          totalSpent: 0
        };
      }

      try {
        // Fetch campaigns from both tables
        const [{ data: newProjects }, { data: legacyProjects }] = await Promise.all([
          supabase
            .from('projects_new')
            .select('status, budget')
            .eq('brand_id', user.id),
          supabase
            .from('projects')
            .select('status, budget')
            .eq('brand_id', user.id)
        ]);

        const allProjects = [...(newProjects || []), ...(legacyProjects || [])];
        
        const totalCampaigns = allProjects.length;
        const activeCampaigns = allProjects.filter(p => p.status === 'active').length;
        const totalSpent = allProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

        // Get unique creators from deals
        const { data: deals } = await supabase
          .from('deals')
          .select('creator_id')
          .eq('brand_id', user.id);

        const uniqueCreators = new Set(deals?.map(d => d.creator_id) || []);
        const totalCreators = uniqueCreators.size;

        return {
          totalCampaigns,
          activeCampaigns,
          totalCreators,
          totalSpent
        };
      } catch (error) {
        console.error('Error fetching brand dashboard data:', error);
        throw error;
      }
    },
    enabled: !!user?.id
  });
};
