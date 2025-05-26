
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
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

    console.log('Starting creator profile update with data:', updatedData);

    try {
      // Prepare creator_profiles update data with explicit user_id
      const displayName = `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim();
      
      const creatorProfileData = {
        user_id: user.id, // Explicitly set user_id as required
        display_name: displayName,
        bio: updatedData.bio || '',
        primary_platform: updatedData.primaryPlatform || '',
        content_type: updatedData.contentType || '',
        audience_type: updatedData.audienceType || '',
        audience_location: updatedData.audienceLocation?.primary || 'Global',
        industries: updatedData.industries || [],
        creator_type: updatedData.creatorType || '',
        updated_at: new Date().toISOString()
      };

      console.log('Upserting creator profile with data:', creatorProfileData);

      const { error: upsertError } = await supabase
        .from('creator_profiles')
        .upsert(creatorProfileData, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error('Supabase error upserting creator profile:', upsertError);
        throw new Error(`Database upsert failed: ${upsertError.message}`);
      }

      console.log('Creator profile upserted successfully');

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

      console.log('Creator profile update completed successfully');
    } catch (error) {
      console.error('Error updating creator profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to update profile', {
        description: errorMessage
      });
      throw error;
    }
  };

  const toggleVisibilitySetting = async (setting: keyof CreatorProfile['visibilitySettings']) => {
    if (!user?.id || !profile) return;

    try {
      // For now, just update local state since visibility settings aren't in creator_profiles yet
      const newValue = !profile.visibilitySettings[setting];

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
