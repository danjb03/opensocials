import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole } from '@/utils/getUserRole';
import type { UserRole } from '@/lib/auth';

interface BrandProfile {
  user_id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  industry: string | null;
  budget_range: string | null;
  brand_bio: string | null;
  brand_goal: string | null;
  campaign_focus: string[] | null;
  created_at: string;
  updated_at: string;
}

interface CreatorProfile {
  user_id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  social_handles: Record<string, string> | null;
  content_types: string[] | null;
  platforms: string[] | null;
  audience_size: number | null;
  engagement_rate: number | null;
  created_at: string;
  updated_at: string;
}

interface UnifiedAuthData {
  user: {
    id: string;
    email?: string;
    [key: string]: unknown;
  } | null;
  role: UserRole | null;
  brandProfile: BrandProfile | null;
  creatorProfile: CreatorProfile | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Unified authentication hook that consolidates all auth-related data fetching
 * Replaces: useAuth, useUserRole, useBrandProfile, useCreatorProfile (data parts)
 */
export const useUnifiedAuth = (): UnifiedAuthData => {
  const { user, isLoading: authLoading } = useAuth();
  
  // Single query for all user-related data
  const { data, isLoading: dataLoading, error } = useQuery({
    queryKey: ['unified-auth', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Fetch all user data in parallel
      const [roleResult, brandProfileResult, creatorProfileResult] = await Promise.allSettled([
        getUserRole(user.id),
        supabase.from('brand_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('creator_profiles').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      const role = roleResult.status === 'fulfilled' ? roleResult.value : null;
      const brandProfile = brandProfileResult.status === 'fulfilled' && brandProfileResult.value.data 
        ? brandProfileResult.value.data 
        : null;
      const creatorProfile = creatorProfileResult.status === 'fulfilled' && creatorProfileResult.value.data 
        ? creatorProfileResult.value.data 
        : null;

      return {
        role,
        brandProfile,
        creatorProfile
      };
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2
  });

  return {
    user,
    role: data?.role || null,
    brandProfile: data?.brandProfile || null,
    creatorProfile: data?.creatorProfile || null,
    isLoading: authLoading || dataLoading,
    error: error?.message || null
  };
};

/**
 * Hook for brand-specific auth data
 */
export const useBrandAuth = () => {
  const { user, role, brandProfile, isLoading, error } = useUnifiedAuth();
  
  return {
    user,
    role,
    profile: brandProfile,
    isLoading,
    error,
    isBrand: role === 'brand' || role === 'super_admin'
  };
};

/**
 * Hook for creator-specific auth data
 */
export const useCreatorAuth = () => {
  const { user, role, creatorProfile, isLoading, error } = useUnifiedAuth();
  
  return {
    user,
    role,
    profile: creatorProfile,
    isLoading,
    error,
    isCreator: role === 'creator' || role === 'super_admin'
  };
};