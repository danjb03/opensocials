
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface AgencyBrand {
  user_id: string;
  company_name: string;
  email: string;
  created_at: string;
  status: string;
  industry: string | null;
  budget_range: string | null;
  logo_url: string | null;
}

export const useAgencyBrands = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['agency-brands', user?.id],
    queryFn: async (): Promise<AgencyBrand[]> => {
      if (!user?.id) return [];

      // First get the users managed by this agency
      const { data: agencyUsers, error: agencyError } = await supabase
        .from('agency_users')
        .select('user_id')
        .eq('agency_id', user.id);

      if (agencyError) {
        console.error('Error fetching agency users:', agencyError);
        throw agencyError;
      }

      if (!agencyUsers || agencyUsers.length === 0) {
        return [];
      }

      const userIds = agencyUsers.map(au => au.user_id);

      // Get brand profiles for those users
      const { data: brandProfiles, error: brandError } = await supabase
        .from('brand_profiles')
        .select('user_id, company_name, industry, budget_range, logo_url, created_at')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      if (brandError) {
        console.error('Error fetching brand profiles:', brandError);
        throw brandError;
      }

      if (!brandProfiles || brandProfiles.length === 0) {
        return [];
      }

      // Get profiles for email and status
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, status')
        .in('id', brandProfiles.map(bp => bp.user_id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Transform data to match expected format
      return brandProfiles.map(brand => {
        const profile = profiles?.find(p => p.id === brand.user_id);
        return {
          user_id: brand.user_id,
          company_name: brand.company_name || 'Unknown Company',
          email: profile?.email || 'No email',
          created_at: brand.created_at,
          status: profile?.status || 'unknown',
          industry: brand.industry,
          budget_range: brand.budget_range,
          logo_url: brand.logo_url,
        };
      });
    },
    enabled: !!user?.id,
  });
};
