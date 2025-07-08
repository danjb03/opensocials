
import { useEffect, useState } from 'react';
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

export const useUnifiedAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;
    
    const init = async () => {
      try {
        console.log('🚀 useUnifiedAuth - Starting initialization...');
        
        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ useUnifiedAuth - Session error:', sessionError);
          setIsLoading(false);
          setHasFetched(true);
          return;
        }

        setSession(currentSession);
        
        if (!currentSession?.user) {
          console.log('🔍 useUnifiedAuth - No user found in session');
          setIsLoading(false);
          setHasFetched(true);
          return;
        }

        const currentUser = currentSession.user;
        setUser(currentUser);
        setEmailConfirmed(!!currentUser.email_confirmed_at);

        console.log('👤 useUnifiedAuth - User found:', currentUser.id);

        // Get user role
        let userRole = await getUserRole(currentUser.id);
        
        // Special handling for known super admin user
        if (!userRole && currentUser.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
          console.log('🔧 useUnifiedAuth - Detected known super admin user, forcing role');
          userRole = 'super_admin';
          await updateUserMetadata(currentUser.id, 'super_admin');
        }

        console.log('🎯 useUnifiedAuth - User role:', userRole);
        setRole(userRole);

        // Fetch role-specific profiles
        if (userRole === 'brand') {
          console.log('👔 useUnifiedAuth - Fetching brand profile');
          const { data: brandData, error: brandError } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

          if (brandError) {
            console.error('❌ useUnifiedAuth - Brand profile error:', brandError);
          } else if (brandData) {
            console.log('✅ useUnifiedAuth - Brand profile loaded');
            setBrandProfile(brandData);
          }
        } else if (userRole === 'creator') {
          console.log('🎨 useUnifiedAuth - Fetching creator profile');
          const { data: creatorData, error: creatorError } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

          if (creatorError) {
            console.error('❌ useUnifiedAuth - Creator profile error:', creatorError);
          } else if (creatorData) {
            console.log('✅ useUnifiedAuth - Creator profile loaded');
            setCreatorProfile(creatorData);
          }
        }

      } catch (error) {
        console.error('❌ useUnifiedAuth - Initialization error:', error);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
        console.log('✅ useUnifiedAuth - Initialization complete');
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('🔐 useUnifiedAuth - Auth state change:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setEmailConfirmed(!!newSession.user.email_confirmed_at);
        } else {
          setSession(null);
          setUser(null);
          setRole(null);
          setBrandProfile(null);
          setCreatorProfile(null);
          setEmailConfirmed(null);
          setHasFetched(false);
        }
      }
    );

    init();

    return () => {
      subscription.unsubscribe();
    };
  }, [hasFetched]);

  return {
    session,
    user,
    role,
    brandProfile,
    creatorProfile,
    isLoading,
    emailConfirmed,
  };
};

// Brand-specific hook
export const useBrandAuth = () => {
  const authData = useUnifiedAuth();
  
  return {
    user: authData.user,
    profile: authData.brandProfile,
    isLoading: authData.isLoading,
    role: authData.role
  };
};

// Creator-specific hook
export const useCreatorAuth = () => {
  const authData = useUnifiedAuth();
  
  return {
    user: authData.user,
    profile: authData.creatorProfile,
    isLoading: authData.isLoading,
    role: authData.role
  };
};

// Admin-specific hook
export const useAdminAuth = () => {
  const authData = useUnifiedAuth();
  
  return {
    user: authData.user,
    profile: authData.user,
    isLoading: authData.isLoading,
    role: authData.role
  };
};

// Agency-specific hook
export const useAgencyAuth = () => {
  const authData = useUnifiedAuth();
  
  return {
    user: authData.user,
    profile: authData.user,
    isLoading: authData.isLoading,
    role: authData.role
  };
};
