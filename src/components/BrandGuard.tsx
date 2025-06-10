
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from '@/components/ui/sonner';

interface BrandGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const BrandGuard = ({ children, redirectTo = '/auth' }: BrandGuardProps) => {
  const { user, role, isLoading: authLoading } = useUnifiedAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkBrandAccess = async () => {
      // Don't do anything if auth is still loading
      if (authLoading) return;
      
      // Super admins can access everything - bypass all checks
      if (role === 'super_admin') {
        console.log('Super admin detected - bypassing all brand checks');
        setIsChecking(false);
        return;
      }

      // Check if current location is a super-admin route
      if (location.pathname.startsWith('/super-admin')) {
        console.log('Super admin route detected - redirecting non-super-admin user');
        navigate('/', { replace: true });
        return;
      }

      const bypassCheck = localStorage.getItem('bypass_brand_check');
      if (bypassCheck) {
        localStorage.removeItem('bypass_brand_check');
        setIsChecking(false);
        return;
      }

      if (!user) {
        navigate('/auth', { replace: true });
        return;
      }

      // Only check brand role for non-super-admin users
      if (role !== 'brand') {
        console.log('User role is not brand:', role);
        toast.error('You do not have brand access');
        navigate(redirectTo, { replace: true });
        return;
      }

      const isSetupPage = location.pathname === '/brand/setup-profile';
      if (isSetupPage) {
        setIsChecking(false);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('brand_profiles')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
          setIsChecking(false);
          return;
        }

        // Only redirect if no profile exists at all
        if (!profile) {
          navigate('/brand/setup-profile', { replace: true });
          return;
        }

        setIsChecking(false);
      } catch (err) {
        console.error('❌ Error in guard logic:', err);
        setIsChecking(false);
      }
    };

    checkBrandAccess();
  }, [user, role, authLoading, navigate, redirectTo, location.pathname]);

  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BrandGuard;
