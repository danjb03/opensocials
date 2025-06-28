
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

interface ConnectedAccount {
  id: string;
  platform: string;
  handle: string;
  status: string;
  last_run: string | null;
  created_at: string;
  error_message: string | null;
}

export const useConnectedAccounts = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['social-accounts', user?.id],
    queryFn: async (): Promise<ConnectedAccount[]> => {
      if (!user?.id) return [];

      console.log('🔍 Fetching connected social accounts for user:', user.id);

      const { data, error } = await supabase
        .from('creators_social_accounts')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching connected accounts:', error);
        throw error;
      }

      console.log('📊 Connected accounts found:', data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
