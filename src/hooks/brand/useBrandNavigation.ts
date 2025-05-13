
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export const useBrandNavigation = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const redirectToDashboard = () => {
    console.log("Attempting to navigate to appropriate dashboard");
    
    // For super admins, always redirect to super admin dashboard
    if (role === 'super_admin') {
      console.log("User is super_admin, redirecting to super-admin dashboard");
      navigate('/super-admin', { replace: true });
      return;
    }
    
    // Check for admin role
    if (role === 'admin') {
      console.log("User is admin, redirecting to admin dashboard");
      navigate('/admin', { replace: true });
      return;
    }
    
    // For brand users, set bypass flag and redirect
    if (role === 'brand') {
      console.log("User is brand, redirecting to brand dashboard");
      // Set a flag to bypass the redirect check in BrandGuard
      localStorage.setItem('bypass_brand_check', 'true');
      navigate('/brand', { replace: true });
      return;
    }
    
    // Default fallback
    console.log("No specific role found, redirecting to home");
    navigate('/', { replace: true });
  };

  return { redirectToDashboard };
};
