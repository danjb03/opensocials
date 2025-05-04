
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
      
      // Only check for brand users
      if (role !== 'brand') {
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

        const isSetupPage = location.pathname === '/brand/setup-profile';

        if (!brandProfile?.is_complete && !isSetupPage) {
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
