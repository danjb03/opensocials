
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

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
      // Wait for auth to complete
      if (authLoading) return;
      
      // If not logged in, redirect to auth
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // If not a brand or super_admin, redirect
      if (role !== 'brand' && role !== 'super_admin') {
        navigate(redirectTo);
        return;
      }

      // Super admins can access all brand routes
      if (role === 'super_admin') {
        setIsChecking(false);
        return;
      }
      
      // Only check profile completion for actual brands
      try {
        // Check if brand profile exists and is complete
        const { data: brandProfile } = await supabase
          .from('brand_profiles')
          .select('is_complete')
          .eq('user_id', user.id)
          .maybeSingle();
        
        const isSetupPage = window.location.pathname === '/brand/setup-profile';

        if (!brandProfile?.is_complete && !isSetupPage) {
          navigate('/brand/setup-profile');
        }
      } catch (err) {
        console.error('Error checking brand profile:', err);
      } finally {
        setIsChecking(false);
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
