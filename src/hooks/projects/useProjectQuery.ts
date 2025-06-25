
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  currency: string;
  created_at: string;
  brand_id: string;
}

export const useProjectQuery = (projectId?: string) => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['project', projectId, user?.id],
    queryFn: async (): Promise<ProjectData | null> => {
      if (!projectId || !user?.id) return null;

      // Try new projects table first
      const { data: newProject, error: newError } = await supabase
        .from('projects_new')
        .select('*')
        .eq('id', projectId)
        .eq('brand_id', user.id)
        .maybeSingle();

      if (!newError && newProject) {
        return newProject;
      }

      // Fallback to legacy projects table
      const { data: legacyProject, error: legacyError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('brand_id', user.id)
        .maybeSingle();

      if (legacyError) {
        console.error('Error fetching project:', legacyError);
        throw legacyError;
      }

      return legacyProject;
    },
    enabled: !!projectId && !!user?.id
  });
};
