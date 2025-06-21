
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/projects';
import { ProjectFilters } from './useProjectFilters';

export const useProjectQuery = (filters: ProjectFilters) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: rawProjects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['projects', user?.id, filters],
    queryFn: async (): Promise<Project[]> => {
      if (!user?.id) {
        return [];
      }
      
      try {
        // First, try to fetch from the new projects_new table
        const { data: newProjects, error: newProjectsError } = await supabase
          .from('projects_new')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false });

        let allProjects: any[] = [];

        if (!newProjectsError && newProjects) {
          // Transform new projects to match the expected format
          const transformedNewProjects = newProjects.map((project: any) => ({
            id: project.id,
            name: project.name || '',
            campaign_type: project.campaign_type || '',
            start_date: project.start_date || '',
            end_date: project.end_date || '',
            budget: Number(project.budget) || 0,
            currency: project.currency || 'USD',
            platforms: Array.isArray(project.platforms) ? project.platforms : [],
            status: project.status || 'draft',
            is_priority: false, // Default for new projects
            brand_id: project.brand_id
          }));
          allProjects = [...transformedNewProjects];
        }

        // Also fetch from the legacy projects table for backwards compatibility
        const { data: legacyProjects, error: legacyError } = await supabase
          .from('projects')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false });

        if (!legacyError && legacyProjects) {
          const transformedLegacyProjects = legacyProjects.map((item: any) => ({
            id: item.id,
            name: item.name || '',
            campaign_type: item.campaign_type || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            budget: Number(item.budget) || 0,
            currency: item.currency || 'USD',
            platforms: Array.isArray(item.platforms) ? item.platforms : [],
            status: item.status || 'draft',
            is_priority: Boolean(item.is_priority)
          }));
          allProjects = [...allProjects, ...transformedLegacyProjects];
        }

        // Remove duplicates based on ID (in case a project exists in both tables)
        const uniqueProjects = allProjects.filter((project, index, self) => 
          index === self.findIndex(p => p.id === project.id)
        );

        console.log('Fetched projects:', uniqueProjects.length, 'total projects');
        console.log('Projects by status:', uniqueProjects.reduce((acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {}));

        return uniqueProjects;
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  // Handle error with toast
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load projects. Please try again.",
      variant: "destructive",
    });
  }

  return {
    rawProjects,
    isLoading,
    error,
    refetch
  };
};
