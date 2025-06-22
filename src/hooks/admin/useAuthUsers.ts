
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
      console.log('🔍 Starting auth users fetch...');
      console.log('📡 Attempting to call get-auth-users edge function...');
      
      try {
        // Call edge function to get auth users (requires admin privileges)
        const { data, error } = await supabase.functions.invoke('get-auth-users', {
          body: { page, per_page: perPage }
        });

        if (error) {
          console.error('❌ Edge function error:', error);
          console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          throw new Error(`Failed to fetch users: ${error.message}`);
        }

        if (!data) {
          console.error('❌ No data returned from edge function');
          throw new Error('No data returned from edge function');
        }

        console.log('✅ Successfully fetched users:', data);
        return data;
      } catch (err) {
        console.error('❌ Complete error in useAuthUsers:', err);
        console.error('Error type:', typeof err);
        console.error('Error constructor:', err?.constructor?.name);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for error:`, error?.message);
      return failureCount < 2;
    },
  });
};
