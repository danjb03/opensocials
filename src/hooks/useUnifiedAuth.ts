
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
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
  is_complete?: boolean;
}

export const useUnifiedAuth = () => {
  const { user, session, isLoading: authLoading, emailConfirmed } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setRole(null);
      setBrandProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch role using updated priority logic
        console.log('🔍 Fetching user role with priority logic');
        const userRole = await getUserRole(user.id);
        console.log('🎯 Retrieved user role:', userRole);
        setRole(userRole);

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
    isLoading: authLoading || isLoading,
    emailConfirmed
  };
};
