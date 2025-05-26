
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type CreatorCRMItem = {
  creator_id: string;
  first_name: string;
  last_name: string;
  email: string;
  primary_platform: string;
  follower_count: string;
  engagement_rate: string;
  status: string;
  total_deals: number;
  active_deals: number;
  last_active_at: string;
};

export function useCreatorCRM() {
  const [creators, setCreators] = useState<CreatorCRMItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCreators();
  }, [searchQuery]);

  const fetchCreators = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Fetch from creator_profiles and join with user data if needed
      let query = supabase
        .from('creator_profiles')
        .select(`
          user_id,
          display_name,
          primary_platform,
          follower_count,
          engagement_rate,
          created_at,
          updated_at
        `);

      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,primary_platform.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching creator CRM data:', error);
        setIsError(true);
        return;
      }

      // Transform the data to match expected CRM structure
      const transformedData: CreatorCRMItem[] = (data || []).map(profile => {
        const displayName = profile.display_name || '';
        const nameParts = displayName.split(' ');
        
        return {
          creator_id: profile.user_id,
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          email: '', // Not available in creator_profiles, would need auth.users join
          primary_platform: profile.primary_platform || '',
          follower_count: profile.follower_count?.toString() || '0',
          engagement_rate: profile.engagement_rate ? `${profile.engagement_rate}%` : '0%',
          status: 'active', // Default status
          total_deals: 0, // Would need to count from deals table
          active_deals: 0, // Would need to count from deals table
          last_active_at: profile.updated_at || profile.created_at || ''
        };
      });

      setCreators(transformedData);
    } catch (error) {
      console.error('Error in fetchCreators:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return {
    creators,
    isLoading,
    isError,
    searchQuery,
    handleSearch
  };
}
