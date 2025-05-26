
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCreatorProfileData, CreatorProfile } from './useCreatorProfileData';
import { useCreatorProfileActions } from './useCreatorProfileActions';

export type { CreatorProfile } from './useCreatorProfileData';

export const useCreatorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [platformAnalytics, setPlatformAnalytics] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const { profile, isLoading, setProfile } = useCreatorProfileData();
  const { updateProfile, toggleVisibilitySetting } = useCreatorProfileActions(profile, setProfile);

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('creator-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('creator-assets')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: data.publicUrl
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile((prev) => prev ? { ...prev, avatarUrl: data.publicUrl } : null);

      toast({
        description: 'Your profile picture has been updated',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        description: 'Failed to upload profile picture',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const connectSocialPlatform = async (platform: string) => {
    if (!user?.id || !profile) return;

    try {
      const platformKey = `${platform}_connected`;
      const isCurrentlyConnected = profile.socialConnections[platform as keyof typeof profile.socialConnections];

      const { error } = await supabase
        .from('profiles')
        .update({ [platformKey]: !isCurrentlyConnected })
        .eq('id', user.id);

      if (error) throw error;

      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          socialConnections: {
            ...prev.socialConnections,
            [platform]: !isCurrentlyConnected
          }
        };
      });

      toast({
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} successfully ${isCurrentlyConnected ? 'disconnected' : 'connected'}`,
      });
    } catch (error) {
      console.error(`Error toggling ${platform} connection:`, error);
      toast({
        description: `Failed to ${profile.socialConnections[platform as keyof typeof profile.socialConnections] ? 'disconnect' : 'connect'} ${platform}`,
        variant: 'destructive'
      });
    }
  };

  return {
    profile,
    isLoading,
    isEditing,
    setIsEditing,
    isPreviewMode,
    setIsPreviewMode,
    isUploading,
    updateProfile,
    uploadAvatar,
    toggleVisibilitySetting,
    connectSocialPlatform,
    platformAnalytics
  };
};
