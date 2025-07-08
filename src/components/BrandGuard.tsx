
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { toast } from 'sonner';

interface BrandGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const BrandGuard = ({ children, redirectTo = '/auth' }: BrandGuardProps) => {
  const { user, role, isLoading: authLoading, brandProfile } = useUnifiedAuth();
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

      if (!user) {
        console.log('No user found, redirecting to auth');
        navigate('/auth', { replace: true });
        return;
      }

      // For non-super-admin users on brand routes, check if they have brand role
      if (role !== 'brand') {
        console.log('User role is not brand and not super admin:', role);
        toast.error('You do not have brand access');
        navigate(redirectTo, { replace: true });
        return;
      }

      const isSetupPage = location.pathname === '/brand/setup-profile';
      if (isSetupPage) {
        setIsChecking(false);
        return;
      }

      // Check if we have a brand profile
      console.log('🔍 Checking brand profile status:', brandProfile);
      
      if (!brandProfile) {
        console.log('⚠️ No brand profile found, redirecting to setup');
        navigate('/brand/setup-profile', { replace: true });
        return;
      }

      console.log('✅ Brand profile found, allowing access');
      setIsChecking(false);
    };

    checkBrandAccess();
  }, [user, role, authLoading, brandProfile, navigate, redirectTo, location.pathname]);

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
