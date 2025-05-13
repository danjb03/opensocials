
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const useBrandRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isLoading: authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBrandProfile = async () => {
      // Don't do anything while auth is still loading
      if (authLoading) {
        return;
      }

      console.log('🧠 useBrandRedirect - Auth state:', { 
        userId: user?.id,
        role,
        authLoading,
        path: location.pathname
      });
      
      // Skip all checks for super_admin users
      if (role === 'super_admin') {
        console.log('✅ Super admin detected, skipping brand redirect checks');
        setIsChecking(false);
        return;
      }

      // If no user, we can't check profile (should be handled by auth guards anyway)
      if (!user) {
        setIsChecking(false);
        return;
      }
      
      // Only check for brand users
      if (role !== 'brand') {
        console.log('⏩ Non-brand user detected, skipping brand profile check');
        setIsChecking(false);
        return;
      }

      // Skip check if we're already on the setup page
      if (location.pathname === '/brand/setup-profile') {
        console.log('✅ Already on setup page, skipping redirect check');
        setIsChecking(false);
        return;
      }

      // Skip check if we're on a super admin route
      if (location.pathname.startsWith('/super-admin')) {
        console.log('✅ On super-admin route, skipping brand profile check');
        setIsChecking(false);
        return;
      }

      try {
        // Check if brand profile exists and is complete
        const { data: brandProfile } = await supabase
          .from('profiles')
          .select('is_complete')
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();

        console.log('📊 Brand profile check:', brandProfile);

        // Only redirect if is_complete is explicitly false
        if (brandProfile?.is_complete === false) {
          console.log('🚨 Profile marked as incomplete, redirecting to setup');
          navigate('/brand/setup-profile', { replace: true });
          return;
        }

        console.log('✅ Profile is complete or not found, allowing access');
        setIsChecking(false);
      } catch (err) {
        console.error('❌ Error checking brand profile:', err);
        setIsChecking(false);
      }
    };

    checkBrandProfile();
  }, [user, role, authLoading, navigate, location.pathname]);

  return { isChecking };
};
