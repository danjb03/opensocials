
import { useAuth } from '@/lib/auth';

export const useBrandNavigation = () => {
  const { role } = useAuth();

  const redirectToDashboard = () => {
    console.log("Attempting to navigate to appropriate dashboard");
    
    if (role === 'super_admin') {
      console.log("User is super_admin, redirecting to super-admin dashboard");
      window.location.href = '/super-admin';
      return;
    }
    
    // Only set bypass flag for brand users
    if (role === 'brand') {
      // Set a flag to bypass the redirect check in BrandGuard
      window.localStorage.setItem('bypass_brand_check', 'true');
    }
    
    // Force a full page reload to ensure fresh data
    window.location.href = role === 'super_admin' ? '/super-admin' : '/brand';
  };

  return { redirectToDashboard };
};
