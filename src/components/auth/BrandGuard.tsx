
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

  console.log('🔍 BrandGuard Debug:', {
    user: !!user,
    role,
    authLoading,
    brandProfile: !!brandProfile,
    pathname: location.pathname
  });

  useEffect(() => {
    const checkBrandAccess = async () => {
      // Don't do anything if auth is still loading
      if (authLoading) {
        console.log('🔍 BrandGuard - Auth still loading');
        return;
      }
      
      // Super admins can access everything - bypass all checks
      if (role === 'super_admin') {
        console.log('🔍 BrandGuard - Super admin detected, allowing access');
        setIsChecking(false);
        return;
      }

      if (!user) {
        console.log('🔍 BrandGuard - No user found, redirecting to auth');
        navigate('/auth', { replace: true });
        return;
      }

      // For non-super-admin users on brand routes, check if they have brand role
      if (role !== 'brand') {
        console.log('🔍 BrandGuard - User role is not brand and not super admin:', role);
        toast.error('You do not have brand access');
        navigate(redirectTo, { replace: true });
        return;
      }

      const isSetupPage = location.pathname === '/brand/setup-profile';
      if (isSetupPage) {
        console.log('🔍 BrandGuard - On setup page, allowing access');
        setIsChecking(false);
        return;
      }

      // Check if we have a brand profile for regular brand users
      console.log('🔍 BrandGuard - Checking brand profile status:', brandProfile);
      
      if (!brandProfile) {
        console.log('🔍 BrandGuard - No brand profile found, but allowing access for now');
        // Don't redirect to setup, just allow access
        // navigate('/brand/setup-profile', { replace: true });
        // return;
      }

      console.log('✅ BrandGuard - Access granted');
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
