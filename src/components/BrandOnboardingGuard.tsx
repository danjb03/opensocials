
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface BrandOnboardingGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const BrandOnboardingGuard = ({ 
  children, 
  redirectTo = '/brand/setup-profile' 
}: BrandOnboardingGuardProps) => {
  const { user, role, isLoading: authLoading } = useAuth();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBrandProfile = async () => {
      // Wait for auth to complete
      if (authLoading || !user) return;
      
      // Only check for brand users
      if (role !== 'brand') {
        setIsCheckingProfile(false);
        return;
      }

      try {
        // First get the profile id
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Check if brand profile exists and is complete
        const { data: brandProfile } = await supabase
          .from('brand_profiles')
          .select('is_complete')
          .eq('user_id', profileData.id)
          .maybeSingle();

        setIsProfileComplete(!!brandProfile?.is_complete);
      } catch (err) {
        console.error('Error checking brand profile:', err);
        setIsProfileComplete(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkBrandProfile();
  }, [user, role, authLoading]);

  // Redirect if needed after checking profile
  useEffect(() => {
    if (!authLoading && !isCheckingProfile && !isProfileComplete && role === 'brand') {
      navigate(redirectTo);
    }
  }, [isCheckingProfile, isProfileComplete, role, redirectTo, navigate, authLoading]);

  // Show loading state while checking
  if (authLoading || isCheckingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show children if profile complete or not a brand
  return <>{children}</>;
};

export default BrandOnboardingGuard;
