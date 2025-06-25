
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

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
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['agency-creators', user?.id],
    queryFn: async (): Promise<AgencyCreator[]> => {
      if (!user?.id) return [];

      // First get the users managed by this agency with role 'managed_creator'
      const { data: agencyUsers, error: agencyError } = await supabase
        .from('agency_users')
        .select('user_id')
        .eq('agency_id', user.id)
        .eq('role', 'managed_creator');

      if (agencyError) {
        console.error('Error fetching agency users:', agencyError);
        throw agencyError;
      }

      if (!agencyUsers || agencyUsers.length === 0) {
        return [];
      }

      const userIds = agencyUsers.map(au => au.user_id);

      // Get creator profiles for those users only
      const { data: creatorProfiles, error: creatorError } = await supabase
        .from('creator_profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          primary_platform,
          follower_count,
          engagement_rate,
          avatar_url,
          created_at
        `)
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      if (creatorError) {
        console.error('Error fetching creator profiles:', creatorError);
        throw creatorError;
      }

      if (!creatorProfiles || creatorProfiles.length === 0) {
        return [];
      }

      // Get profiles for email and status - only for these specific users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, status')
        .in('id', creatorProfiles.map(cp => cp.user_id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Transform data to match expected format
      return creatorProfiles.map(creator => {
        const profile = profiles?.find(p => p.id === creator.user_id);
        return {
          user_id: creator.user_id,
          first_name: creator.first_name || 'Unknown',
          last_name: creator.last_name || 'User',
          email: profile?.email || 'No email',
          created_at: creator.created_at,
          status: profile?.status || 'unknown',
          primary_platform: creator.primary_platform,
          follower_count: creator.follower_count,
          engagement_rate: creator.engagement_rate,
          avatar_url: creator.avatar_url,
        };
      });
    },
    enabled: !!user?.id,
  });
};
