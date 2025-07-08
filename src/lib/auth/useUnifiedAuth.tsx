
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole, updateUserMetadata } from '@/utils/getUserRole';
import type { Session, User } from '@supabase/supabase-js';

// Types
export type UserRole = 'creator' | 'brand' | 'admin' | 'agency' | 'super_admin';

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
  is_complete?: boolean;
}

interface CreatorProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  primary_platform: string | null;
  content_types: string[] | null;
  platforms: string[] | null;
  industries: string[] | null;
  social_handles: any;
  audience_location: any;
  visibility_settings: any;
  is_profile_complete?: boolean;
  follower_count?: number;
  engagement_rate?: number;
  creator_type?: string;
}

interface UnifiedAuthState {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  brandProfile: BrandProfile | null;
  creatorProfile: CreatorProfile | null;
  isLoading: boolean;
  emailConfirmed: boolean | null;
}

// Context
const UnifiedAuthContext = createContext<UnifiedAuthState>({
  session: null,
  user: null,
  role: null,
  brandProfile: null,
  creatorProfile: null,
  isLoading: true,
  emailConfirmed: null,
});

// Provider component
export const UnifiedAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Memoized fetch functions to prevent re-creation
  const fetchBrandProfile = useCallback(async (userId: string) => {
    console.log('👔 UnifiedAuthProvider - Fetching brand profile for:', userId);
    try {
      const { data: brandData, error: brandError } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (brandError) {
        console.error('❌ UnifiedAuthProvider - Brand profile error:', brandError);
        return null;
      }

      if (brandData) {
        console.log('✅ UnifiedAuthProvider - Brand profile loaded');
        return brandData;
      }
      return null;
    } catch (error) {
      console.error('❌ UnifiedAuthProvider - Brand profile fetch error:', error);
      return null;
    }
  }, []);

  const fetchCreatorProfile = useCallback(async (userId: string) => {
    console.log('🎨 UnifiedAuthProvider - Fetching creator profile for:', userId);
    try {
      const { data: creatorData, error: creatorError } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (creatorError) {
        console.error('❌ UnifiedAuthProvider - Creator profile error:', creatorError);
        return null;
      }

      if (creatorData) {
        console.log('✅ UnifiedAuthProvider - Creator profile loaded');
        return creatorData;
      }
      return null;
    } catch (error) {
      console.error('❌ UnifiedAuthProvider - Creator profile fetch error:', error);
      return null;
    }
  }, []);

  // Initialize user data
  const initializeUserData = useCallback(async (currentUser: User) => {
    console.log('🚀 UnifiedAuthProvider - Initializing user data for:', currentUser.id);
    
    try {
      // Get user role
      let userRole = await getUserRole(currentUser.id);
      
      // Special handling for known super admin user
      if (!userRole && currentUser.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
        console.log('🔧 UnifiedAuthProvider - Detected known super admin user, forcing role');
        userRole = 'super_admin';
        await updateUserMetadata(currentUser.id, 'super_admin');
      }

      console.log('🎯 UnifiedAuthProvider - User role:', userRole);
      setRole(userRole);

      // Fetch role-specific profiles
      if (userRole === 'brand') {
        const brandData = await fetchBrandProfile(currentUser.id);
        setBrandProfile(brandData);
      } else if (userRole === 'creator') {
        const creatorData = await fetchCreatorProfile(currentUser.id);
        setCreatorProfile(creatorData);
      }

    } catch (error) {
      console.error('❌ UnifiedAuthProvider - User data initialization error:', error);
    }
  }, [fetchBrandProfile, fetchCreatorProfile]);

  // Clear all auth state
  const clearAuthState = useCallback(() => {
    console.log('🧹 UnifiedAuthProvider - Clearing auth state');
    setSession(null);
    setUser(null);
    setRole(null);
    setBrandProfile(null);
    setCreatorProfile(null);
    setEmailConfirmed(null);
  }, []);

  // Set up auth state listener and initialize - only run once
  useEffect(() => {
    if (initialized) return;

    console.log('🔐 UnifiedAuthProvider - Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('🔐 UnifiedAuthProvider - Auth state change:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setEmailConfirmed(!!newSession.user.email_confirmed_at);
          // Defer user data initialization to prevent auth loops
          setTimeout(() => {
            initializeUserData(newSession.user);
          }, 100);
        } else {
          clearAuthState();
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 UnifiedAuthProvider - Getting initial session...');
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ UnifiedAuthProvider - Session error:', sessionError);
          setIsLoading(false);
          return;
        }

        setSession(currentSession);
        
        if (!currentSession?.user) {
          console.log('🔍 UnifiedAuthProvider - No user found in session');
          setIsLoading(false);
          return;
        }

        const currentUser = currentSession.user;
        setUser(currentUser);
        setEmailConfirmed(!!currentUser.email_confirmed_at);

        // Initialize user data with delay to prevent auth loops
        setTimeout(() => {
          initializeUserData(currentUser);
        }, 100);

      } catch (error) {
        console.error('❌ UnifiedAuthProvider - Initialization error:', error);
        setIsLoading(false);
      }
    };

    getInitialSession();
    setInitialized(true);

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, initializeUserData, clearAuthState]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<UnifiedAuthState>(() => ({
    session,
    user,
    role,
    brandProfile,
    creatorProfile,
    isLoading,
    emailConfirmed,
  }), [session, user, role, brandProfile, creatorProfile, isLoading, emailConfirmed]);

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

// Main hook
export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

// Typed sub-hooks
export const useBrandAuth = () => {
  const authData = useUnifiedAuth();
  
  return useMemo(() => ({
    user: authData.user,
    profile: authData.brandProfile,
    isLoading: authData.isLoading,
    role: authData.role,
  }), [authData.user, authData.brandProfile, authData.isLoading, authData.role]);
};

export const useCreatorAuth = () => {
  const authData = useUnifiedAuth();
  
  return useMemo(() => ({
    user: authData.user,
    profile: authData.creatorProfile,
    isLoading: authData.isLoading,
    role: authData.role,
  }), [authData.user, authData.creatorProfile, authData.isLoading, authData.role]);
};

export const useAdminAuth = () => {
  const authData = useUnifiedAuth();
  
  return useMemo(() => ({
    user: authData.user,
    profile: authData.user, // Admins use basic user data
    isLoading: authData.isLoading,
    role: authData.role,
  }), [authData.user, authData.isLoading, authData.role]);
};

export const useAgencyAuth = () => {
  const authData = useUnifiedAuth();
  
  return useMemo(() => ({
    user: authData.user,
    profile: authData.user, // Agencies use basic user data
    isLoading: authData.isLoading,
    role: authData.role,
  }), [authData.user, authData.isLoading, authData.role]);
};
