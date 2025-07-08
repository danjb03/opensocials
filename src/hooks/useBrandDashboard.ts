import { useMemo } from 'react';
import { useProjectData } from './useProjectData';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

export const useBrandDashboard = () => {
  const { user } = useUnifiedAuth();
  const { projects, isLoading: isLoadingProjects } = useProjectData();

  const dashboardData = useMemo(() => {
    if (!user) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalBudget: 0,
      };
    }

    const brandProjects = projects?.filter(project => project.brand_id === user.id) || [];
    const activeProjects = brandProjects.filter(project => project.status === 'active').length;
    const completedProjects = brandProjects.filter(project => project.status === 'completed').length;
    const totalBudget = brandProjects.reduce((sum, project) => sum + (project.budget || 0), 0);

    return {
      totalProjects: brandProjects.length,
      activeProjects,
      completedProjects,
      totalBudget,
    };
  }, [user, projects]);

  return {
    ...dashboardData,
    isLoading: isLoadingProjects,
  };
};
