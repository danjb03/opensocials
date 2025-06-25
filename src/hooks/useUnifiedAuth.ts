
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export function useUnifiedAuth() {
  const { user, role, isLoading: authLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Debug logging for auth state
  useEffect(() => {
    const info = {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      role,
      authLoading,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
    console.log('🔐 useUnifiedAuth state:', info);
  }, [user, role, authLoading]);

  // Brand Profile Query
  const { 
    data: brandProfile, 
    isLoading: brandLoading, 
    error: brandError 
  } = useQuery({
    queryKey: ['brand-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🏢 No user ID for brand profile query');
        return null;
      }
      
      console.log('🏢 Fetching brand profile for user:', user.id);
      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('🏢 Brand profile error:', error);
        throw error;
      }
      
      console.log('🏢 Brand profile result:', data);
      return data;
    },
    enabled: !!user?.id && (role === 'brand' || role === 'super_admin'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Creator Profile Query
  const { 
    data: creatorProfile, 
    isLoading: creatorLoading, 
    error: creatorError 
  } = useQuery({
    queryKey: ['creator-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🎨 No user ID for creator profile query');
        return null;
      }
      
      console.log('🎨 Fetching creator profile for user:', user.id);
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('🎨 Creator profile error:', error);
        throw error;
      }
      
      console.log('🎨 Creator profile result:', data);
      return data;
    },
    enabled: !!user?.id && (role === 'creator' || role === 'super_admin'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const isLoading = authLoading || brandLoading || creatorLoading;

  // Log any errors
  useEffect(() => {
    if (brandError) {
      console.error('🏢 Brand profile error:', brandError);
    }
    if (creatorError) {
      console.error('🎨 Creator profile error:', creatorError);
    }
  }, [brandError, creatorError]);

  // Final debug log
  useEffect(() => {
    console.log('🔄 useUnifiedAuth final state:', {
      isLoading,
      hasUser: !!user,
      role,
      hasBrandProfile: !!brandProfile,
      hasCreatorProfile: !!creatorProfile,
      brandLoading,
      creatorLoading,
      authLoading
    });
  }, [isLoading, user, role, brandProfile, creatorProfile, brandLoading, creatorLoading, authLoading]);

  return {
    user,
    role,
    brandProfile,
    creatorProfile,
    isLoading,
    // Expose debug info for troubleshooting
    debugInfo,
  };
}
