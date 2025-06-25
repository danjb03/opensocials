
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
    staleTime: 10000,
    gcTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Simplified user profile fetch without complex typing
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      try {
        // Get profile first
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Get role separately
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('approved', true)
          .single();

        return {
          profile,
          role: roleData?.role || profile?.role || null
        };
      } catch (error) {
        console.log('Profile fetch error:', error);
        return { profile: null, role: null };
      }
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
