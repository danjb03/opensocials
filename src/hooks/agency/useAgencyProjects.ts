
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface AgencyProject {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  currency: string;
  brand_id: string;
  brand_name: string;
  created_at: string;
}

export const useAgencyProjects = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['agency-projects', user?.id],
    queryFn: async (): Promise<AgencyProject[]> => {
      if (!user?.id) return [];

      // First get the brand users managed by this agency
      const { data: agencyBrands, error: agencyError } = await supabase
        .from('agency_users')
        .select('user_id')
        .eq('agency_id', user.id)
        .eq('role', 'managed_brand');

      if (agencyError) {
        console.error('Error fetching agency brands:', agencyError);
        throw agencyError;
      }

      if (!agencyBrands || agencyBrands.length === 0) {
        return [];
      }

      const brandIds = agencyBrands.map(ab => ab.user_id);

      // Get projects for those brands only
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          start_date,
          end_date,
          budget,
          currency,
          brand_id,
          created_at
        `)
        .in('brand_id', brandIds)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      // Get brand names
      const { data: brandProfiles, error: brandError } = await supabase
        .from('brand_profiles')
        .select('user_id, company_name')
        .in('user_id', brandIds);

      if (brandError) {
        console.error('Error fetching brand profiles:', brandError);
        throw brandError;
      }

      // Transform data to include brand names
      return projects.map(project => {
        const brand = brandProfiles?.find(bp => bp.user_id === project.brand_id);
        return {
          ...project,
          brand_name: brand?.company_name || 'Unknown Brand'
        };
      });
    },
    enabled: !!user?.id,
  });
};
