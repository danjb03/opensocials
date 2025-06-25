
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export const useCreatorProfile = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-profile-detailed', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching creator profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });
};
