
import { useEffect } from 'react';
import BrandGuard from './BrandGuard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

const BrandOnboardingGuard = ({ children, redirectTo = '/auth' }) => {
  const { user } = useAuth();

  useEffect(() => {
    const logUserData = async () => {
      if (!user) return;
      
      console.log('👁️‍🗨️ BrandOnboardingGuard running for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('❌ Profile fetch error:', error);
        return;
      }

      console.log('📦 Profile:', data);
      console.log('✅ is_complete:', data?.is_complete);
      console.log('🚪 bypass_brand_check:', localStorage.getItem('bypass_brand_check'));
    };

    logUserData();
  }, [user]);

  return <BrandGuard redirectTo={redirectTo}>{children}</BrandGuard>;
};

export default BrandOnboardingGuard;
