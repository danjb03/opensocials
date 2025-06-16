
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CreatorCRMData {
  id: string;
  name: string;
  email: string;
  platform: string;
  followers: string;
  engagement: string;
  status: string;
  lastActive: string;
  totalDeals: number;
  activeDeals: number;
}

export interface CreatorCRMFilters {
  search?: string;
  platform?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useCreatorCRM = (filters: CreatorCRMFilters = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-creator-crm', filters],
    queryFn: async () => {
      console.log('Fetching creators with filters:', filters);
      
      try {
        const { data, error } = await supabase.functions.invoke('get-admin-crm', {
          body: {
            type: 'creator',
            search: filters.search || '',
            platform: filters.platform || 'all',
            status: filters.status || 'all',
            page: filters.page || 1,
            pageSize: filters.pageSize || 50,
            orderBy: 'created_at',
            orderDirection: 'desc'
          }
        });

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        console.log('Creator CRM response:', data);

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch creator data');
        }

        return {
          creators: (data.data || []).map((creator: any): CreatorCRMData => ({
            id: creator.creator_id || creator.id || '',
            name: creator.first_name && creator.last_name 
              ? `${creator.first_name} ${creator.last_name}`
              : creator.first_name || 'Unknown Creator',
            email: creator.email || 'No email',
            platform: creator.primary_platform || 'Unknown',
            followers: creator.follower_count || '0',
            engagement: creator.engagement_rate || '0%',
            status: creator.status || 'active',
            lastActive: creator.last_active_at || creator.created_at || new Date().toISOString(),
            totalDeals: creator.total_deals || 0,
            activeDeals: creator.active_deals || 0,
          })),
          pagination: data.pagination || {
            total: 0,
            page: 1,
            pageSize: 50,
            pageCount: 0
          }
        };
      } catch (error) {
        console.error('Error in useCreatorCRM:', error);
        throw error;
      }
    }
  });

  return {
    creators: data?.creators || [],
    pagination: data?.pagination,
    isLoading,
    error
  };
};
