
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedCRMData {
  totalBrands: number;
  activeBrands: number;
  totalCreators: number;
  activeCreators: number;
  activeDeals: number;
  totalRevenue: number;
}

export const useOptimizedCRM = () => {
  return useQuery({
    queryKey: ['optimized-crm-data'],
    queryFn: async (): Promise<OptimizedCRMData> => {
      console.log('🚀 Fetching optimized CRM data...');
      
      try {
        // Fetch all data in parallel for better performance
        const [brandProfilesResponse, dealsResponse] = await Promise.all([
          supabase
            .from('brand_profiles')
            .select('user_id, created_at'),
          supabase
            .from('deals')
            .select('id, status, value')
            .in('status', ['active', 'accepted', 'pending'])
        ]);

        if (brandProfilesResponse.error) {
          console.error('Error fetching brand profiles:', brandProfilesResponse.error);
          throw brandProfilesResponse.error;
        }

        if (dealsResponse.error) {
          console.error('Error fetching deals:', dealsResponse.error);
          throw dealsResponse.error;
        }

        const brands = brandProfilesResponse.data || [];
        const deals = dealsResponse.data || [];

        // Get user profiles for brands in a single query
        const userIds = brands.map(brand => brand.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, status')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);

        // Calculate stats
        const activeBrands = brands.filter(brand => {
          const profile = profileMap.get(brand.user_id);
          return profile?.status === 'active';
        }).length;

        const activeDeals = deals.filter(deal => 
          deal.status === 'active' || deal.status === 'accepted'
        ).length;

        const totalRevenue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

        // For creators, use a simpler approach to avoid the edge function issues
        const { data: creatorProfiles } = await supabase
          .from('creator_profiles')
          .select('user_id, created_at');

        const totalCreators = creatorProfiles?.length || 0;
        
        // Get creator user profiles
        const creatorUserIds = creatorProfiles?.map(c => c.user_id) || [];
        const { data: creatorUserProfiles } = await supabase
          .from('profiles')
          .select('id, status')
          .in('id', creatorUserIds);

        const activeCreators = creatorUserProfiles?.filter(p => p.status === 'active').length || 0;

        console.log('✅ CRM data fetched successfully');

        return {
          totalBrands: brands.length,
          activeBrands,
          totalCreators,
          activeCreators,
          activeDeals,
          totalRevenue,
        };

      } catch (error) {
        console.error('❌ Error in useOptimizedCRM:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
