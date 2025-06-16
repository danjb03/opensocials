
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  phone?: string;
  role?: string;
  user_metadata?: Record<string, any>;
}

interface AuthUsersResponse {
  users: AuthUser[];
  total: number;
}

export const useAuthUsers = (page = 1, perPage = 50) => {
  return useQuery({
    queryKey: ['auth-users', page, perPage],
    queryFn: async (): Promise<AuthUsersResponse> => {
      console.log('Fetching auth users from edge function...');
      
      // Call edge function to get auth users (requires admin privileges)
      const { data, error } = await supabase.functions.invoke('get-auth-users', {
        body: { page, per_page: perPage }
      });

      if (error) {
        console.error('Error fetching auth users:', error);
        throw new Error(`Failed to fetch users: ${error.message}`);
      }

      console.log('Successfully fetched users:', data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
