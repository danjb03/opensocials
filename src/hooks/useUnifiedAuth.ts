import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { getUserRole, updateUserMetadata, clearAuthState } from '@/utils/getUserRole';
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
}

export const useUnifiedAuth = () => {
  const { user, session, isLoading: authLoading, emailConfirmed } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setRole(null);
      setBrandProfile(null);
      setCreatorProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch role using improved priority logic
        console.log('🔍 Fetching user role with security definer function');
        let userRole = await getUserRole(user.id);
        
        // Special handling for known super admin user
        if (!userRole && user.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
          console.log('🔧 Detected known super admin user, ensuring correct role');
          userRole = 'super_admin';
          // Update metadata to match
          await updateUserMetadata(user.id, 'super_admin');
        }

        console.log('🎯 Retrieved user role:', userRole);
        setRole(userRole);

        // Only fetch profiles if role is determined and not super_admin accessing other dashboards
        if (userRole && userRole !== 'super_admin') {
          // If user is a brand, fetch their profile
          if (userRole === 'brand') {
            console.log('👔 Fetching brand profile');
            const { data: brandData, error: brandError } = await supabase
              .from('brand_profiles')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (brandError) {
              console.error('❌ Error fetching brand profile:', brandError);
            } else if (brandData) {
              console.log('✅ Brand profile fetched:', brandData);
              setBrandProfile(brandData);
            }
          }

          // If user is a creator, fetch their profile
          if (userRole === 'creator') {
            console.log('🎨 Fetching creator profile');
            const { data: creatorData, error: creatorError } = await supabase
              .from('creator_profiles')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (creatorError) {
              console.error('❌ Error fetching creator profile:', creatorError);
            } else if (creatorData) {
              console.log('✅ Creator profile fetched:', creatorData);
              setCreatorProfile(creatorData);
            }
          }
        }
      } catch (error) {
        console.error('❌ Error in fetchUserData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading]);

  return {
    user,
    session,
    role,
    brandProfile,
    creatorProfile,
    isLoading: authLoading || isLoading,
    emailConfirmed
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
