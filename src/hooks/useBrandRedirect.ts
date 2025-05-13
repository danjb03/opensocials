
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
      // Wait for auth to complete
      if (authLoading || !user) {
        setIsChecking(false);
        return;
      }
      
      // Skip check for super_admin users - prevent redirection for super admins
      if (role === 'super_admin') {
        console.log('Super admin detected, skipping brand profile check');
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

      // Check if we're on a super admin route
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

        console.log('Brand profile check:', brandProfile);

        // Only redirect if is_complete is explicitly false
        // If is_complete is true or null/undefined, don't redirect
        if (brandProfile?.is_complete === false) {
          navigate('/brand/setup-profile');
        }
      } catch (err) {
        console.error('Error checking brand profile:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkBrandProfile();
  }, [user, role, authLoading, navigate, location.pathname]);

  return { isChecking };
};
