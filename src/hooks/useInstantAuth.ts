
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

// Aggressive auth caching for instant page loads
export const useInstantAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Cache auth state aggressively
  const { data: session, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Get user and role in parallel with session
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const [profileResult, rolesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('approved', true)
          .single()
      ]);

      return {
        profile: profileResult.data,
        role: rolesResult.data?.role || profileResult.data?.role || null
      };
    },
    enabled: !!session?.user?.id,
    staleTime: 30000,
    gcTime: 60000,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  return {
    user: session?.user || null,
    role: userProfile?.role || null,
    profile: userProfile?.profile || null,
    isLoading: !isInitialized,
    session
  };
};
