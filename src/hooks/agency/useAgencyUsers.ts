
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface AgencyUser {
  id: string;
  user_id: string;
  agency_id: string;
  role: string;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    role: string | null;
    status: string | null;
  };
}

export const useAgencyUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['agency-users', user?.id],
    queryFn: async (): Promise<AgencyUser[]> => {
      if (!user?.id) return [];

      // First get agency users
      const { data: agencyUsers, error: agencyError } = await supabase
        .from('agency_users')
        .select('*')
        .eq('agency_id', user.id)
        .order('created_at', { ascending: false });

      if (agencyError) {
        console.error('Error fetching agency users:', agencyError);
        throw agencyError;
      }

      if (!agencyUsers || agencyUsers.length === 0) {
        return [];
      }

      // Get user IDs
      const userIds = agencyUsers.map(au => au.user_id);

      // Fetch profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, status')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine the data
      return agencyUsers.map(agencyUser => ({
        ...agencyUser,
        profiles: profiles?.find(profile => profile.id === agencyUser.user_id) || null
      }));
    },
    enabled: !!user?.id,
  });
};
