
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
    if (!user?.id) {
      toast.error('Authentication required', {
        description: 'Please log in to update your profile.'
      });
      return;
    }

    if (!profile) {
      toast.error('Profile not found', {
        description: 'Unable to find your profile to update.'
      });
      return;
    }

    try {
      console.log('Profile update requested with data:', updatedData);
      
      // Prepare database update with all required fields
      const dbUpdateData: Record<string, any> = {
        first_name: updatedData.firstName || profile.firstName,
        last_name: updatedData.lastName || profile.lastName,
        bio: updatedData.bio || profile.bio || '',
        primary_platform: updatedData.primaryPlatform || profile.primaryPlatform || '',
        content_type: updatedData.contentType || profile.contentType || '',
        audience_type: updatedData.audienceType || profile.audienceType || '',
        industries: updatedData.industries || profile.industries || [],
        creator_type: updatedData.creatorType || profile.creatorType || '',
        is_profile_complete: true, // Always mark as complete when updating
        updated_at: new Date().toISOString()
      };

      // Handle audience location
      if (updatedData.audienceLocation) {
        dbUpdateData.audience_location = updatedData.audienceLocation;
      } else if (profile.audienceLocation) {
        dbUpdateData.audience_location = profile.audienceLocation;
      }

      console.log('Updating profile with data:', dbUpdateData);

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdateData)
        .eq('id', user.id);

      if (error) {
        console.error('Supabase error updating profile:', error);
        throw error;
      }

      console.log('Profile updated in database successfully');

      // Save industry and creator type data if provided
      if (updatedData.industries && updatedData.industries.length > 0 && updatedData.creatorType) {
        try {
          await submitCreatorProfile({
            userId: user.id,
            industries: updatedData.industries,
            creatorType: updatedData.creatorType
          });
          console.log('Industry and creator type data saved successfully');
        } catch (error) {
          console.error('Error saving industry and creator type data:', error);
          // Don't fail the entire update for this
          toast.error('Profile updated but industry data failed to save', {
            description: 'Please try updating your industries again.'
          });
        }
      }

      // Update local state - merge with existing profile data
      setProfile(prev => {
        if (!prev) return null;
        const updatedProfile = { 
          ...prev, 
          ...updatedData,
          isProfileComplete: true
        };
        console.log('Local profile state updated:', updatedProfile);
        return updatedProfile;
      });

      toast.success('Profile updated successfully!', {
        description: 'Your profile is now complete and ready for brand collaborations.'
      });

      console.log('Profile update completed successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please check your internet connection and try again.'
      });
      throw error; // Re-throw to handle in component
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
