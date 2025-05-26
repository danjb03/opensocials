
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { submitCreatorProfile } from '@/utils/creatorOnboarding';
import { CreatorProfile } from './useCreatorProfileData';

export const useCreatorProfileActions = (
  profile: CreatorProfile | null, 
  setProfile: (updater: (prev: CreatorProfile | null) => CreatorProfile | null) => void
) => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();

  const updateProfile = async (updatedData: Partial<CreatorProfile>) => {
    if (!user?.id || !profile) return;

    try {
      console.log('Profile update requested with data:', updatedData);
      
      const dbUpdateData: Record<string, any> = {
        first_name: updatedData.firstName ?? profile.firstName,
        last_name: updatedData.lastName ?? profile.lastName,
        bio: updatedData.bio ?? profile.bio,
        primary_platform: updatedData.primaryPlatform ?? profile.primaryPlatform,
        content_type: updatedData.contentType ?? profile.contentType,
        audience_type: updatedData.audienceType ?? profile.audienceType,
        is_profile_complete: updatedData.isProfileComplete ?? profile.isProfileComplete
      };

      if (updatedData.audienceLocation) {
        dbUpdateData.audience_location = updatedData.audienceLocation;
      }

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdateData)
        .eq('id', user.id);

      if (error) {
        console.error('Supabase error updating profile:', error);
        throw error;
      }

      if (updatedData.industries && updatedData.industries.length > 0 && updatedData.creatorType) {
        try {
          await submitCreatorProfile({
            userId: user.id,
            industries: updatedData.industries,
            creatorType: updatedData.creatorType
          });
        } catch (error) {
          console.error('Error saving industry and creator type data:', error);
          toast.error('Your profile was updated but we had trouble saving your industry selections', {
            description: 'Please try again or contact support.'
          });
        }
      }

      toast.success('Profile updated successfully', {
        description: 'Your profile has been updated.'
      });

      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please try again later.'
      });
    }
  };

  const toggleVisibilitySetting = async (setting: keyof CreatorProfile['visibilitySettings']) => {
    if (!user?.id || !profile) return;

    try {
      const updateData: Record<string, boolean> = {};
      const dbField = setting.replace(/([A-Z])/g, "_$1").toLowerCase();
      const newValue = !profile.visibilitySettings[setting];
      updateData[dbField] = newValue;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          visibilitySettings: {
            ...prev.visibilitySettings,
            [setting]: newValue
          }
        };
      });

      uiToast({
        description: `${setting.replace('show', '')} visibility has been ${newValue ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
      uiToast({
        description: 'Failed to update visibility settings',
        variant: 'destructive'
      });
    }
  };

  return {
    updateProfile,
    toggleVisibilitySetting
  };
};
