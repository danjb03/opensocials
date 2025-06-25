
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export const useBrandRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isLoading: authLoading } = useUnifiedAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBrandProfile = async () => {
      // Don't do anything while auth is still loading
      if (authLoading) {
        return;
      }

      
      // Skip all checks for super_admin users
      if (role === 'super_admin') {
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
        setIsChecking(false);
        return;
      }

      // Skip check if we're already on the setup page
      if (location.pathname === '/brand/setup-profile') {
        setIsChecking(false);
        return;
      }

      // Skip check if we're on a super admin route
      if (location.pathname.startsWith('/super-admin')) {
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


        // Only redirect if is_complete is explicitly false
        if (brandProfile?.is_complete === false) {
          navigate('/brand/setup-profile', { replace: true });
          return;
        }

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
