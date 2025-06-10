
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export const useBrandNavigation = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const redirectToDashboard = () => {
    // For super admins, redirect to index page to let them choose
    if (role === 'super_admin') {
      navigate('/', { replace: true });
      return;
    }
    
    // Check for admin role
    if (role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    
    // Check for agency role
    if (role === 'agency') {
      navigate('/agency', { replace: true });
      return;
    }
    
    // Check for creator role
    if (role === 'creator') {
      navigate('/creator', { replace: true });
      return;
    }
    
    // For brand users, set bypass flag and redirect
    if (role === 'brand') {
      // Set a flag to bypass the redirect check in BrandGuard
      localStorage.setItem('bypass_brand_check', 'true');
      navigate('/brand', { replace: true });
      return;
    }
    
    // Default fallback
    navigate('/', { replace: true });
  };

  return { redirectToDashboard };
};
