
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

  // Brand Profile Query - OPTIONAL, non-blocking
  const { 
    data: brandProfile, 
    isLoading: brandLoading 
  } = useQuery({
    queryKey: ['brand-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
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
      } catch (error) {
        console.error('Brand profile fetch failed:', error);
        return null;
      }
    },
    enabled: !!user?.id && (role === 'brand' || role === 'super_admin'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry failed profile queries
  });

  // Creator Profile Query - OPTIONAL, non-blocking
  const { 
    data: creatorProfile, 
    isLoading: creatorLoading 
  } = useQuery({
    queryKey: ['creator-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
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
      } catch (error) {
        console.error('Creator profile fetch failed:', error);
        return null;
      }
    },
    enabled: !!user?.id && (role === 'creator' || role === 'super_admin'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry failed profile queries
  });

  // CRITICAL: Only consider auth loading, never profile loading
  // Profiles are optional enhancements, not requirements for rendering
  const isLoading = authLoading;

  return {
    user,
    role,
    brandProfile: brandProfile || null,
    creatorProfile: creatorProfile || null,
    isLoading,
    // Add profile property for backward compatibility
    profile: creatorProfile || null,
  };
}

// Export alias for creator-specific usage
export const useCreatorAuth = useUnifiedAuth;
