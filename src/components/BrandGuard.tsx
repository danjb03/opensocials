
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

interface BrandGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const BrandGuard = ({ children, redirectTo = '/auth' }: BrandGuardProps) => {
  const { user, role, isLoading: authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkBrandAccess = async () => {
      console.log('👁️‍🗨️ BrandGuard running');
      console.log('🧾 Auth state:', { user: user?.id, role, authLoading });
      console.log('📍 Path:', location.pathname);

      // Don't do anything if auth is still loading
      if (authLoading) return;
      
      // Allow super_admin to bypass immediately
      if (role === 'super_admin') {
        console.log('✅ User is super_admin, bypassing brand guard check');
        setIsChecking(false);
        return;
      }

      // Check if current location is a super-admin route
      if (location.pathname.startsWith('/super-admin')) {
        console.log('✅ On super-admin route, allowing access');
        setIsChecking(false);
        return;
      }

      const bypassCheck = localStorage.getItem('bypass_brand_check');
      if (bypassCheck) {
        console.log('✅ Bypassing brand guard check due to bypass flag');
        localStorage.removeItem('bypass_brand_check');
        setIsChecking(false);
        return;
      }

      if (!user) {
        console.log('🚫 User not logged in, redirecting to auth');
        navigate('/auth', { replace: true });
        return;
      }

      if (role !== 'brand') {
        console.log('🚫 User is not brand, redirecting');
        toast.error('You do not have brand access');
        navigate(redirectTo, { replace: true });
        return;
      }

      const isSetupPage = location.pathname === '/brand/setup-profile';
      if (isSetupPage) {
        console.log('✅ On setup page, allowing access');
        setIsChecking(false);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_complete')
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();

        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
          setIsChecking(false);
          return;
        }

        console.log('📦 Profile check result:', profile);

        // Only redirect if profile is explicitly marked as incomplete
        // This reduces unnecessary redirects and improves performance
        if (profile?.is_complete === false) {
          console.log('🚨 Profile marked as incomplete, redirecting to setup');
          navigate('/brand/setup-profile', { replace: true });
          return;
        }

        console.log('✅ Profile check passed, allowing access');
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
