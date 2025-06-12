
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

      const { data: agencyUsers, error } = await supabase
        .from('agency_users')
        .select(`
          *,
          profiles!agency_users_user_id_fkey (
            id,
            email,
            first_name,
            last_name,
            role,
            status
          )
        `)
        .eq('agency_id', user.id);

      if (error) {
        console.error('Error fetching agency users:', error);
        throw error;
      }

      return agencyUsers || [];
    },
    enabled: !!user?.id,
  });
};
