
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type CreatorCRMItem = {
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const query = {
    page: Number(searchParams.get('page')) || 1,
    pageSize: 10,
    search: searchQuery,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['creators', query],
    queryFn: async () => {
      console.log('Fetching creators with query:', query);
      
      const response = await supabase.functions.invoke('get-admin-creator-crm', {
        body: query
      });
      
      console.log('Creator CRM API response:', response);
      
      if (response.error) {
        console.error('Creator CRM API error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch creators');
      }
      
      if (!response.data || !response.data.success) {
        console.error('Creator CRM API invalid response format:', response);
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    },
  });

  const handleSearch = (search: string) => {
    // Don't update if the search term is the same
    if (search === searchQuery) return;
    
    setSearchParams({ search, page: '1' });
  };

  return {
    creators: data?.data as CreatorCRMItem[] || [],
    isLoading,
    isError,
    searchQuery,
    handleSearch,
  };
}
