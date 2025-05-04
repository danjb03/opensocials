
import { useEffect } from 'react';
import BrandGuard from './BrandGuard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface BrandOnboardingGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const BrandOnboardingGuard = ({ children, redirectTo = '/auth' }: BrandOnboardingGuardProps) => {
  const { user } = useAuth();

  // Debug check on initial load
  useEffect(() => {
    const logUserData = async () => {
      if (!user) return;
      
      console.log('BrandOnboardingGuard: Current user:', user);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching profile in onboarding guard:', error);
          return;
        }
        
        console.log('BrandOnboardingGuard: User profile:', data);
        
        // Check bypass flag for debugging
        const bypassCheck = localStorage.getItem('bypass_brand_check');
        console.log('BrandOnboardingGuard: bypass_brand_check flag:', bypassCheck);
      } catch (error) {
        console.error('Error in onboarding guard profile check:', error);
      }
    };
    
    logUserData();
  }, [user]);
  
  return <BrandGuard redirectTo={redirectTo}>{children}</BrandGuard>;
};

export default BrandOnboardingGuard;
