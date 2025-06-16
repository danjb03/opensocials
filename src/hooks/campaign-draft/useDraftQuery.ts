
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDraftQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['campaign-draft', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log('Fetching draft for user:', userId);
      
      const { data, error } = await supabase
        .from('project_drafts')
        .select('*')
        .eq('brand_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching draft:', error);
        throw error;
      }

      console.log('Fetched draft:', data);
      return data;
    },
    enabled: !!userId,
    staleTime: 30000, // Cache for 30 seconds to reduce refetching
    gcTime: 300000 // Keep in cache for 5 minutes
  });
};
