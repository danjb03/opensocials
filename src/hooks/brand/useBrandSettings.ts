
import { useState } from 'react';
import { useBrandProfile } from '@/hooks/useBrandProfile';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

export const useBrandSettings = () => {
  const { user } = useUnifiedAuth();
  const profileQuery = useBrandProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (updates: any) => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('brand_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      await profileQuery.refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isUpdating,
    updateProfile
  };
};
