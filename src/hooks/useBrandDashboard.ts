
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export interface BrandDashboardData {
  projects: any[];
  todoItems: any[];
  projectStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalSpend: number;
  };
}

export const useBrandDashboard = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['brand-dashboard', user?.id],
    queryFn: async (): Promise<BrandDashboardData> => {
      if (!user?.id) {
        return {
          projects: [],
          todoItems: [],
          projectStats: {
            totalProjects: 0,
            activeProjects: 0,
            completedProjects: 0,
            totalSpend: 0
          }
        };
      }

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects_new')
        .select('*')
        .eq('brand_id', user.id);

      const projectStats = {
        totalProjects: projects?.length || 0,
        activeProjects: projects?.filter(p => p.status === 'active').length || 0,
        completedProjects: projects?.filter(p => p.status === 'completed').length || 0,
        totalSpend: projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0
      };

      const todoItems = [
        { id: '1', text: 'Review campaign proposals', priority: 'high' },
        { id: '2', text: 'Approve content submissions', priority: 'medium' }
      ];

      return {
        projects: projects || [],
        todoItems,
        projectStats
      };
    },
    enabled: !!user?.id
  });
};
