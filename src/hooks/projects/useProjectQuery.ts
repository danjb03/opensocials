
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
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }

        // Transform and validate projects
        const validProjects: Project[] = (data || []).map((item: any) => ({
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

        return validProjects;
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
