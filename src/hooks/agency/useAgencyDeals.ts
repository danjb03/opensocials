
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface AgencyDeal {
  id: string;
  title: string;
  value: number;
  status: string;
  creator_name: string;
  brand_name: string;
  created_at: string;
}

export const useAgencyDeals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['agency-deals', user?.id],
    queryFn: async (): Promise<AgencyDeal[]> => {
      if (!user?.id) return [];

      // Get all users managed by this agency (both brands and creators)
      const { data: agencyUsers, error: agencyError } = await supabase
        .from('agency_users')
        .select('user_id, role')
        .eq('agency_id', user.id);

      if (agencyError) {
        console.error('Error fetching agency users:', agencyError);
        throw agencyError;
      }

      if (!agencyUsers || agencyUsers.length === 0) {
        return [];
      }

      const brandIds = agencyUsers.filter(u => u.role === 'managed_brand').map(u => u.user_id);
      const creatorIds = agencyUsers.filter(u => u.role === 'managed_creator').map(u => u.user_id);

      if (brandIds.length === 0 || creatorIds.length === 0) {
        return [];
      }

      // Get deals involving agency's brands and creators only
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          value,
          status,
          creator_id,
          brand_id,
          created_at
        `)
        .in('brand_id', brandIds)
        .in('creator_id', creatorIds)
        .order('created_at', { ascending: false });

      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        throw dealsError;
      }

      if (!deals || deals.length === 0) {
        return [];
      }

      // Get creator and brand names
      const { data: creators, error: creatorsError } = await supabase
        .from('creator_profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', creatorIds);

      const { data: brands, error: brandsError } = await supabase
        .from('brand_profiles')
        .select('user_id, company_name')
        .in('user_id', brandIds);

      if (creatorsError || brandsError) {
        console.error('Error fetching creator/brand profiles:', creatorsError || brandsError);
        throw creatorsError || brandsError;
      }

      // Transform data to include names
      return deals.map(deal => {
        const creator = creators?.find(c => c.user_id === deal.creator_id);
        const brand = brands?.find(b => b.user_id === deal.brand_id);
        
        return {
          ...deal,
          creator_name: creator ? `${creator.first_name} ${creator.last_name}` : 'Unknown Creator',
          brand_name: brand?.company_name || 'Unknown Brand'
        };
      });
    },
    enabled: !!user?.id,
  });
};
