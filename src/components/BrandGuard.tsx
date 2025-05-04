
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

// Define which fields are required for a brand profile to be considered complete
const REQUIRED_BRAND_FIELDS = ['company_name'];

interface BrandGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const BrandGuard = ({ 
  children, 
  redirectTo = '/auth' 
}: BrandGuardProps) => {
  const { user, role, isLoading: authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBrandAccess = async () => {
      console.log('👁️‍🗨️ BrandGuard running');
      console.log('🧾 Auth state:', { user: user?.id, role, authLoading });
      console.log('📍 Path:', window.location.pathname);

      // Check for bypass flag (temporary, for one navigation)
      const bypassCheck = localStorage.getItem('bypass_brand_check');
      if (bypassCheck) {
        console.log('✅ Bypassing brand guard check due to bypass flag');
        localStorage.removeItem('bypass_brand_check');
        setIsChecking(false);
        return;
      }

      // Wait for auth to complete
      if (authLoading) {
        console.log('🌀 Auth still loading, waiting...');
        return;
      }
      
      // If not logged in, redirect to auth
      if (!user) {
        console.log('🚫 User not logged in, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      // If not a brand or super_admin, redirect
      if (role !== 'brand' && role !== 'super_admin') {
        console.log('🚫 User is not a brand or super_admin, redirecting');
        navigate(redirectTo);
        return;
      }

      // Super admins can access all brand routes
      if (role === 'super_admin') {
        console.log('✅ User is super_admin, allowing access');
        setIsChecking(false);
        return;
      }
      
      try {
        // First check if we're already on the setup page
        const isSetupPage = window.location.pathname === '/brand/setup-profile';
        
        if (isSetupPage) {
          console.log('✅ Already on setup page, allowing access');
          setIsChecking(false);
          return;
        }
        
        // Check user role status first - if it's approved, we don't need to force setup
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (roleError) {
          console.error('❌ Error checking role status:', roleError);
          navigate('/auth');
          return;
        }
        
        // If role status is not approved, redirect to setup profile
        const isApproved = roleData?.status === 'approved';
        
        console.log('🔑 Role status check - isApproved:', isApproved);
        
        if (!isApproved) {
          console.log('🚨 User role not approved, redirecting to setup');
          navigate('/brand/setup-profile');
          return;
        }
        
        // Fetch the brand profile
        const { data: brandProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*') // Get all fields to check required ones
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();
        
        if (profileError) {
          console.error('❌ Error fetching brand profile:', profileError);
          navigate('/auth');
          return;
        }
        
        console.log('📦 Raw profile fetch response:', brandProfile);
        
        // Check for required fields
        const missingRequiredFields = REQUIRED_BRAND_FIELDS.filter(field => !brandProfile?.[field]);
        const profileComplete = brandProfile?.is_complete === true;
        
        console.log('❓ Missing required fields:', missingRequiredFields);
        console.log('✅ Profile status - complete:', profileComplete);
        
        if ((missingRequiredFields.length > 0 || !profileComplete)) {
          console.log('🚨 Brand profile missing required fields or not complete, redirecting to setup');
          navigate('/brand/setup-profile');
          return;
        }

        console.log('✅ All guard checks passed, showing brand dashboard');
        setIsChecking(false);
      } catch (err) {
        console.error('❌ Error checking brand access:', err);
        navigate('/auth');
        return;
      }
    };

    checkBrandAccess();
  }, [user, role, authLoading, navigate, redirectTo]);

  // Show loading state while checking
  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default BrandGuard;
