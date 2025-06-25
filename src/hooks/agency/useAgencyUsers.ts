
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface AgencyUser {
  id: string;
  user_id: string;
  agency_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    status?: string;
  };
}

export const useAgencyUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['agency-users', user?.id],
    queryFn: async (): Promise<AgencyUser[]> => {
      if (!user?.id) return [];

      // Get agency users first
      const { data: agencyUsers, error: agencyError } = await supabase
        .from('agency_users')
        .select('*')
        .eq('agency_id', user.id);

      if (agencyError) {
        console.error('Error fetching agency users:', agencyError);
        throw agencyError;
      }

      if (!agencyUsers || agencyUsers.length === 0) {
        return [];
      }

      // Get profiles for those users
      const userIds = agencyUsers.map(au => au.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, status')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine the data
      return agencyUsers.map(agencyUser => ({
        ...agencyUser,
        profiles: profiles?.find(p => p.id === agencyUser.user_id)
      }));
    },
    enabled: !!user?.id,
  });
};
