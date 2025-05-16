
import { useEffect, useState } from 'react';
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

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['creators', query],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-admin-creator-crm', {
        body: query
      });
      
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const handleSearch = (search: string) => {
    setSearchParams({ search, page: '1' });
    refetch();
  };

  return {
    creators: data?.data as CreatorCRMItem[] || [],
    isLoading,
    isError,
    searchQuery,
    handleSearch,
  };
}
