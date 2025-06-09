
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

      const { data, error } = await supabase
        .from('agency_users')
        .select(`
          *,
          profiles!user_id (
            first_name,
            last_name,
            email,
            role,
            status
          )
        `)
        .eq('agency_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agency users:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};
