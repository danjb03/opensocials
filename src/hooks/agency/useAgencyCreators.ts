
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface AgencyCreator {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  status: string;
  primary_platform: string | null;
  follower_count: number | null;
  engagement_rate: number | null;
  avatar_url: string | null;
}

export const useAgencyCreators = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['agency-creators', user?.id],
    queryFn: async (): Promise<AgencyCreator[]> => {
      if (!user?.id) return [];

      // Get creator profiles for users managed by this agency
      const { data, error } = await supabase
        .from('creator_profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          primary_platform,
          follower_count,
          engagement_rate,
          avatar_url,
          created_at,
          profiles:user_id (
            email,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agency creators:', error);
        throw error;
      }

      // Transform data to match expected format
      return (data || []).map(creator => ({
        user_id: creator.user_id,
        first_name: creator.first_name || 'Unknown',
        last_name: creator.last_name || 'User',
        email: creator.profiles?.email || 'No email',
        created_at: creator.created_at,
        status: creator.profiles?.status || 'unknown',
        primary_platform: creator.primary_platform,
        follower_count: creator.follower_count,
        engagement_rate: creator.engagement_rate,
        avatar_url: creator.avatar_url,
      }));
    },
    enabled: !!user?.id,
  });
};
