
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

export interface ProfileSetupData {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  industry?: string;
  bio?: string;
  platforms?: string[];
  contentTypes?: string[];
}

export const useProfileSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, role } = useUnifiedAuth();

  const setupProfile = async (data: ProfileSetupData) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return false;
    }

    setIsLoading(true);

    try {
      if (role === 'brand') {
        const { error } = await supabase
          .from('brand_profiles')
          .upsert({
            user_id: user.id,
            company_name: data.companyName || '',
            industry: data.industry,
            brand_bio: data.bio,
          }, { onConflict: 'user_id' });

        if (error) throw error;
      } else if (role === 'creator') {
        const { error } = await supabase
          .from('creator_profiles')
          .upsert({
            user_id: user.id,
            first_name: data.firstName || '',
            last_name: data.lastName || '',
            bio: data.bio,
            platforms: data.platforms,
            content_types: data.contentTypes,
          }, { onConflict: 'user_id' });

        if (error) throw error;
      }

      toast.success('Profile setup complete!');
      return true;
    } catch (error) {
      console.error('Error setting up profile:', error);
      toast.error('Failed to setup profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setupProfile,
    isLoading
  };
};
