
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export interface CreatorSearchFilters {
  platform?: string;
  minFollowers?: number;
  maxFollowers?: number;
  engagementRate?: number;
  location?: string;
  contentTypes?: string[];
  industries?: string[];
  search?: string;
}

export interface CreatorSearchResult {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  primary_platform: string;
  follower_count: number;
  engagement_rate: number;
  avatar_url: string;
  platforms: string[];
  content_types: string[];
  industries: string[];
}

export const useCreatorSearchNew = (filters: CreatorSearchFilters = {}) => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-search-new', filters, user?.id],
    queryFn: async (): Promise<CreatorSearchResult[]> => {
      let query = supabase
        .from('creator_profiles')
        .select('*');

      // Apply filters
      if (filters.platform) {
        query = query.contains('platforms', [filters.platform]);
      }

      if (filters.minFollowers) {
        query = query.gte('follower_count', filters.minFollowers);
      }

      if (filters.maxFollowers) {
        query = query.lte('follower_count', filters.maxFollowers);
      }

      if (filters.engagementRate) {
        query = query.gte('engagement_rate', filters.engagementRate);
      }

      if (filters.contentTypes && filters.contentTypes.length > 0) {
        query = query.overlaps('content_types', filters.contentTypes);
      }

      if (filters.industries && filters.industries.length > 0) {
        query = query.overlaps('industries', filters.industries);
      }

      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query
        .order('follower_count', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error searching creators:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });
};
