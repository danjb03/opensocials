
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

      // Get brand profiles for users managed by this agency
      const { data, error } = await supabase
        .from('brand_profiles')
        .select(`
          user_id,
          company_name,
          industry,
          budget_range,
          logo_url,
          created_at,
          profiles:user_id (
            email,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agency brands:', error);
        throw error;
      }

      // Transform data to match expected format
      return (data || []).map(brand => ({
        user_id: brand.user_id,
        company_name: brand.company_name || 'Unknown Company',
        email: brand.profiles?.email || 'No email',
        created_at: brand.created_at,
        status: brand.profiles?.status || 'unknown',
        industry: brand.industry,
        budget_range: brand.budget_range,
        logo_url: brand.logo_url,
      }));
    },
    enabled: !!user?.id,
  });
};
