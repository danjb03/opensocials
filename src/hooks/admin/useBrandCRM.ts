
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BrandCRMData {
  id: string;
  companyName: string;
  email: string;
  industry: string;
  budgetRange: string;
  status: string;
  lastActive: string;
  totalDeals: number;
  activeDeals: number;
}

export interface BrandCRMFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useBrandCRM = (filters: BrandCRMFilters = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-brand-crm', filters],
    queryFn: async () => {
      console.log('Fetching brands with filters:', filters);
      
      try {
        let query = supabase
          .from('brand_profiles')
          .select(`
            user_id,
            company_name,
            industry,
            budget_range,
            created_at,
            profiles!brand_profiles_user_id_fkey(email, status)
          `);

        // Apply search filter
        if (filters.search) {
          query = query.or(`company_name.ilike.%${filters.search}%,profiles.email.ilike.%${filters.search}%`);
        }

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
          query = query.eq('profiles.status', filters.status);
        }

        const { data: brands, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Query error:', error);
          throw error;
        }

        console.log('Raw brand data:', brands);

        if (!brands) return { brands: [], pagination: { total: 0, page: 1, pageSize: 50, pageCount: 0 } };

        // Get deal counts for each brand
        const brandsWithDeals = await Promise.all(
          brands.map(async (brand) => {
            const { data: deals } = await supabase
              .from('deals')
              .select('status')
              .eq('brand_id', brand.user_id);

            const totalDeals = deals?.length || 0;
            const activeDeals = deals?.filter(deal => deal.status === 'active' || deal.status === 'accepted').length || 0;

            return {
              id: brand.user_id,
              companyName: brand.company_name || 'Unknown Company',
              email: brand.profiles?.email || 'No email',
              industry: brand.industry || 'Not specified',
              budgetRange: brand.budget_range || 'Not specified',
              status: brand.profiles?.status || 'active',
              lastActive: brand.created_at || new Date().toISOString(),
              totalDeals,
              activeDeals,
            };
          })
        );

        return {
          brands: brandsWithDeals,
          pagination: {
            total: brandsWithDeals.length,
            page: filters.page || 1,
            pageSize: filters.pageSize || 50,
            pageCount: Math.ceil(brandsWithDeals.length / (filters.pageSize || 50))
          }
        };
      } catch (error) {
        console.error('Error in useBrandCRM:', error);
        throw error;
      }
    }
  });

  return {
    brands: data?.brands || [],
    pagination: data?.pagination,
    isLoading,
    error
  };
};
