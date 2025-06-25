
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

// Simplified auth hook to prevent infinite loops
export const useInstantAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Get session with conservative caching to prevent loops
  const { data: session, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 10000, // Reduced from 30 seconds
    gcTime: 30000, // Reduced from 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Simplified user profile fetch without dependencies that could cause loops
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      // Sequential queries instead of parallel to avoid race conditions
      const profileResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileResult.error) {
        console.log('Profile not found, checking user_roles');
      }

      const rolesResult = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('approved', true)
        .single();

      return {
        profile: profileResult.data,
        role: rolesResult.data?.role || profileResult.data?.role || null
      };
    },
    enabled: !!session?.user?.id,
    staleTime: 10000,
    gcTime: 30000,
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
