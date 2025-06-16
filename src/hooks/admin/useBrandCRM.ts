
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
        // Optimize by limiting initial fetch and using pagination
        const pageSize = filters.pageSize || 50;
        const offset = ((filters.page || 1) - 1) * pageSize;

        // Use more efficient query with limits
        let brandQuery = supabase
          .from('brand_profiles')
          .select('user_id, company_name, industry, budget_range, created_at')
          .range(offset, offset + pageSize - 1);

        const { data: brands, error: brandError } = await brandQuery.order('created_at', { ascending: false });

        if (brandError) {
          console.error('Brand query error:', brandError);
          throw brandError;
        }

        if (!brands) return { brands: [], pagination: { total: 0, page: 1, pageSize: 50, pageCount: 0 } };

        // Get user profiles for all brand user_ids in batches
        const userIds = brands.map(brand => brand.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, status')
          .in('id', userIds);

        if (profileError) {
          console.error('Profile query error:', profileError);
          throw profileError;
        }

        // Create a map for quick lookup
        const profileMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);

        // Apply search filter on the combined data
        let filteredBrands = brands.map(brand => {
          const profile = profileMap.get(brand.user_id);
          return {
            ...brand,
            email: profile?.email || 'No email',
            status: profile?.status || 'active'
          };
        });

        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredBrands = filteredBrands.filter(brand => 
            brand.company_name?.toLowerCase().includes(searchTerm) ||
            brand.email.toLowerCase().includes(searchTerm)
          );
        }

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
          filteredBrands = filteredBrands.filter(brand => brand.status === filters.status);
        }

        console.log('Filtered brand data:', filteredBrands);

        // Get deal counts for each brand (optimize this with a single query)
        const brandsWithDeals = await Promise.all(
          filteredBrands.map(async (brand) => {
            const { data: deals } = await supabase
              .from('deals')
              .select('status')
              .eq('brand_id', brand.user_id);

            const totalDeals = deals?.length || 0;
            const activeDeals = deals?.filter(deal => deal.status === 'active' || deal.status === 'accepted').length || 0;

            return {
              id: brand.user_id,
              companyName: brand.company_name || 'Unknown Company',
              email: brand.email,
              industry: brand.industry || 'Not specified',
              budgetRange: brand.budget_range || 'Not specified',
              status: brand.status,
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
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    brands: data?.brands || [],
    pagination: data?.pagination,
    isLoading,
    error
  };
};
