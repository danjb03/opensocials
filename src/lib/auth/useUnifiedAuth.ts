
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
  const [hasInitialized, setHasInitialized] = useState(false);

  // Single fetch cycle function
  const fetchUserData = async (currentUser: User) => {
    if (!currentUser) return;

    try {
      console.log('🔍 UnifiedAuthProvider - Fetching user data for:', currentUser.id);
      
      // Step 1: Get user role
      let userRole = await getUserRole(currentUser.id);
      
      // Step 2: Handle super admin override
      if (!userRole && currentUser.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
        console.log('🔧 UnifiedAuthProvider - Detected known super admin user, ensuring correct role');
        userRole = 'super_admin';
        await updateUserMetadata(currentUser.id, 'super_admin');
      }

      console.log('🎯 UnifiedAuthProvider - Retrieved user role:', userRole);
      setRole(userRole);

      // Step 3: Fetch role-specific profiles (only if not super_admin)
      if (userRole && userRole !== 'super_admin') {
        // Fetch brand profile if user is brand
        if (userRole === 'brand') {
          console.log('👔 UnifiedAuthProvider - Fetching brand profile');
          const { data: brandData, error: brandError } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

          if (brandError) {
            console.error('❌ UnifiedAuthProvider - Error fetching brand profile:', brandError);
          } else if (brandData) {
            console.log('✅ UnifiedAuthProvider - Brand profile fetched');
            setBrandProfile(brandData);
          }
        }

        // Fetch creator profile if user is creator
        if (userRole === 'creator') {
          console.log('🎨 UnifiedAuthProvider - Fetching creator profile');
          const { data: creatorData, error: creatorError } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

          if (creatorError) {
            console.error('❌ UnifiedAuthProvider - Error fetching creator profile:', creatorError);
          } else if (creatorData) {
            console.log('✅ UnifiedAuthProvider - Creator profile fetched');
            setCreatorProfile(creatorData);
          }
        }
      }
    } catch (error) {
      console.error('❌ UnifiedAuthProvider - Error in fetchUserData:', error);
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

  // Initialize auth state
  useEffect(() => {
    console.log('🔐 UnifiedAuthProvider - Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('🔐 UnifiedAuthProvider - Auth state change:', event, newSession?.user?.id);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setEmailConfirmed(!!newSession.user.email_confirmed_at);
          
          // Only fetch data if email is confirmed and we haven't initialized yet
          if (newSession.user.email_confirmed_at && !hasInitialized) {
            console.log('👤 UnifiedAuthProvider - User authenticated, fetching data...');
            await fetchUserData(newSession.user);
            setHasInitialized(true);
          } else if (!newSession.user.email_confirmed_at) {
            console.log('📧 UnifiedAuthProvider - Email not confirmed yet, skipping data fetch');
            setRole(null);
            setBrandProfile(null);
            setCreatorProfile(null);
          }
        } else {
          clearAuthState();
          setHasInitialized(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('🔍 UnifiedAuthProvider - Initial session check:', currentSession?.user?.id);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setEmailConfirmed(!!currentSession.user.email_confirmed_at);
        
        if (currentSession.user.email_confirmed_at && !hasInitialized) {
          fetchUserData(currentSession.user).then(() => {
            setHasInitialized(true);
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });

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
