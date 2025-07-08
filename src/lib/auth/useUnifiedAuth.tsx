
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const [hasFetched, setHasFetched] = useState(false);

  // One-time initialization function
  const init = async () => {
    if (hasFetched) return;
    
    try {
      console.log('🚀 UnifiedAuthProvider - Starting initialization...');
      
      // Get current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ UnifiedAuthProvider - Session error:', sessionError);
        setIsLoading(false);
        setHasFetched(true);
        return;
      }

      setSession(currentSession);
      
      if (!currentSession?.user) {
        console.log('🔍 UnifiedAuthProvider - No user found in session');
        setIsLoading(false);
        setHasFetched(true);
        return;
      }

      const currentUser = currentSession.user;
      setUser(currentUser);
      setEmailConfirmed(!!currentUser.email_confirmed_at);

      console.log('👤 UnifiedAuthProvider - User found:', currentUser.id);

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
        console.log('👔 UnifiedAuthProvider - Fetching brand profile');
        const { data: brandData, error: brandError } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (brandError) {
          console.error('❌ UnifiedAuthProvider - Brand profile error:', brandError);
        } else if (brandData) {
          console.log('✅ UnifiedAuthProvider - Brand profile loaded');
          setBrandProfile(brandData);
        }
      } else if (userRole === 'creator') {
        console.log('🎨 UnifiedAuthProvider - Fetching creator profile');
        const { data: creatorData, error: creatorError } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (creatorError) {
          console.error('❌ UnifiedAuthProvider - Creator profile error:', creatorError);
        } else if (creatorData) {
          console.log('✅ UnifiedAuthProvider - Creator profile loaded');
          setCreatorProfile(creatorData);
        }
      }

    } catch (error) {
      console.error('❌ UnifiedAuthProvider - Initialization error:', error);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
      console.log('✅ UnifiedAuthProvider - Initialization complete');
    }
  };

  // Clear all auth state
  const clearAuthState = () => {
    setSession(null);
    setUser(null);
    setRole(null);
    setBrandProfile(null);
    setCreatorProfile(null);
    setEmailConfirmed(null);
  };

  // Set up auth state listener and initialize
  useEffect(() => {
    console.log('🔐 UnifiedAuthProvider - Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('🔐 UnifiedAuthProvider - Auth state change:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setEmailConfirmed(!!newSession.user.email_confirmed_at);
        } else {
          clearAuthState();
          setHasFetched(false); // Allow re-fetch on next login
        }
      }
    );

    // Run initialization
    init();

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const contextValue: UnifiedAuthState = {
    session,
    user,
    role,
    brandProfile,
    creatorProfile,
    isLoading,
    emailConfirmed,
  };

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
  
  return {
    user: authData.user,
    profile: authData.brandProfile,
    isLoading: authData.isLoading,
    role: authData.role,
  };
};

export const useCreatorAuth = () => {
  const authData = useUnifiedAuth();
  
  return {
    user: authData.user,
    profile: authData.creatorProfile,
    isLoading: authData.isLoading,
    role: authData.role,
  };
};

export const useAdminAuth = () => {
  const authData = useUnifiedAuth();
  
  return {
    user: authData.user,
    profile: authData.user, // Admins use basic user data
    isLoading: authData.isLoading,
    role: authData.role,
  };
};

export const useAgencyAuth = () => {
  const authData = useUnifiedAuth();
  
  return {
    user: authData.user,
    profile: authData.user, // Agencies use basic user data
    isLoading: authData.isLoading,
    role: authData.role,
  };
};
