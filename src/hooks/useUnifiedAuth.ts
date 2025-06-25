
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useUnifiedAuth() {
  const { user, role, isLoading: authLoading } = useAuth();

  console.log('🔐 useUnifiedAuth - Basic state:', {
    hasUser: !!user,
    userId: user?.id,
    role,
    authLoading
  });

  // Brand Profile Query - only when needed
  const { 
    data: brandProfile, 
    isLoading: brandLoading 
  } = useQuery({
    queryKey: ['brand-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Brand profile error:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id && (role === 'brand' || role === 'super_admin'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Creator Profile Query - only when needed
  const { 
    data: creatorProfile, 
    isLoading: creatorLoading 
  } = useQuery({
    queryKey: ['creator-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Creator profile error:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id && (role === 'creator' || role === 'super_admin'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const isLoading = authLoading || (
    (role === 'brand' || role === 'super_admin') && brandLoading
  ) || (
    (role === 'creator' || role === 'super_admin') && creatorLoading
  );

  return {
    user,
    role,
    brandProfile,
    creatorProfile,
    isLoading,
    // Add profile property for backward compatibility
    profile: creatorProfile,
  };
}

// Export alias for creator-specific usage
export const useCreatorAuth = useUnifiedAuth;
