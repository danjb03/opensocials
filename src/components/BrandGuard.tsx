
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

const REQUIRED_BRAND_FIELDS = ['company_name', 'website', 'logo_url', 'industry'];

interface BrandGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const BrandGuard = ({ children, redirectTo = '/auth' }: BrandGuardProps) => {
  const { user, role, isLoading: authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBrandAccess = async () => {
      console.log('👁️‍🗨️ BrandGuard running');
      console.log('🧾 Auth state:', { user: user?.id, role, authLoading });
      console.log('📍 Path:', window.location.pathname);

      const bypassCheck = localStorage.getItem('bypass_brand_check');
      if (bypassCheck) {
        console.log('✅ Bypassing brand guard check due to bypass flag');
        localStorage.removeItem('bypass_brand_check');
        setIsChecking(false);
        return;
      }

      if (authLoading) return;

      if (!user) {
        console.log('🚫 User not logged in, redirecting to auth');
        navigate('/auth');
        return;
      }

      if (role !== 'brand' && role !== 'super_admin') {
        console.log('🚫 User is not brand or super_admin, redirecting');
        navigate(redirectTo);
        return;
      }

      if (role === 'super_admin') {
        console.log('✅ User is super_admin, allowing access');
        setIsChecking(false);
        return;
      }

      const isSetupPage = window.location.pathname === '/brand/setup-profile';
      if (isSetupPage) {
        console.log('✅ Already on setup page, allowing access');
        setIsChecking(false);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();

        if (profileError || !profile) {
          console.error('❌ Error fetching brand profile:', profileError);
          navigate('/auth');
          return;
        }

        console.log('📦 Raw profile fetch:', profile);

        const isApproved = profile.status === 'accepted' || profile.status === 'approved';
        const missingRequiredFields = REQUIRED_BRAND_FIELDS.filter(field => !profile[field]);
        const profileComplete = profile.is_complete === true;

        console.log('❓ Missing fields:', missingRequiredFields);
        console.log('✅ is_complete:', profileComplete);
        console.log('🔑 isApproved:', isApproved);

        if (missingRequiredFields.length > 0 || !profileComplete || !isApproved) {
          console.log('🚨 Profile incomplete or not approved, redirecting to setup');
          navigate('/brand/setup-profile');
          return;
        }

        console.log('✅ All checks passed. Showing dashboard.');
        setIsChecking(false);
      } catch (err) {
        console.error('❌ Error in guard logic:', err);
        navigate('/auth');
      }
    };

    checkBrandAccess();
  }, [user, role, authLoading, navigate, redirectTo]);

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
