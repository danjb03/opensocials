
import React, { createContext, useContext } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole, updateUserMetadata } from '@/utils/getUserRole';
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

interface AuthContextType {
  user: any;
  session: any;
  role: UserRole | null;
  brandProfile: BrandProfile | null;
  creatorProfile: CreatorProfile | null;
  isLoading: boolean;
  emailConfirmed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setEmailConfirmed(!!session?.user?.email_confirmed_at);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setEmailConfirmed(!!session?.user?.email_confirmed_at);
        
        if (session?.user) {
          // Fetch user data
          await fetchUserData(session.user);
        } else {
          // Clear data when logged out
          setRole(null);
          setBrandProfile(null);
          setCreatorProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (user: any) => {
    try {
      setIsLoading(true);
      
      // Fetch role
      let userRole = await getUserRole(user.id);
      
      // Special handling for known super admin user
      if (!userRole && user.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
        userRole = 'super_admin';
        await updateUserMetadata(user.id, 'super_admin');
      }

      setRole(userRole);

      // Fetch profiles based on role
      if (userRole === 'brand') {
        const { data: brandData } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setBrandProfile(brandData);
      }

      if (userRole === 'creator') {
        const { data: creatorData } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setCreatorProfile(creatorData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    role,
    brandProfile,
    creatorProfile,
    isLoading,
    emailConfirmed
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useUnifiedAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

// Legacy compatibility - create useAuth export
export const useAuth = () => {
  return useUnifiedAuth();
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
