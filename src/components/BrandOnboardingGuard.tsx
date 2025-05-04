
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
      
      console.log('👁️‍🗨️ BrandOnboardingGuard running for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('❌ Error fetching profile in onboarding guard:', error);
          return;
        }
        
        console.log('📦 BrandOnboardingGuard: Full profile data:', data);
        
        // Check specific fields that might cause redirect loops
        const requiredFields = ['company_name', 'website', 'logo_url', 'industry'];
        const missing = requiredFields.filter((f) => !data?.[f]);
        console.log('❓ BrandOnboardingGuard: Missing required fields:', missing);
        console.log('✅ BrandOnboardingGuard: is_complete flag:', data?.is_complete);
        console.log('✅ BrandOnboardingGuard: status value:', data?.status);
        
        // Check bypass flag for debugging
        const bypassCheck = localStorage.getItem('bypass_brand_check');
        console.log('🔄 BrandOnboardingGuard: bypass_brand_check flag:', bypassCheck);
      } catch (error) {
        console.error('❌ Error in onboarding guard profile check:', error);
      }
    };
    
    logUserData();
  }, [user]);
  
  return <BrandGuard redirectTo={redirectTo}>{children}</BrandGuard>;
};

export default BrandOnboardingGuard;
