
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CreatorProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  primaryPlatform: string;
  contentType: string;
  audienceType: string;
  followerCount: string;
  engagementRate: string;
  isProfileComplete: boolean;
  socialConnections: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    linkedin: boolean;
  };
  visibilitySettings: {
    showInstagram: boolean;
    showTiktok: boolean;
    showYoutube: boolean;
    showLinkedin: boolean;
    showLocation: boolean;
    showAnalytics: boolean;
  };
  audienceLocation: {
    primary: string;
    secondary?: string[];
    countries?: { name: string; percentage: number }[];
  };
}

export const useCreatorProfile = () => {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch the creator profile on mount and when user changes
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Get profile data from supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          // Transform data to match our interface
          const transformedProfile: CreatorProfile = {
            id: data.id,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            bio: data.bio || '',
            avatarUrl: data.avatar_url,
            bannerUrl: data.banner_url,
            primaryPlatform: data.primary_platform || '',
            contentType: data.content_type || '',
            audienceType: data.audience_type || '',
            followerCount: data.follower_count || '0',
            engagementRate: data.engagement_rate || '0%',
            isProfileComplete: Boolean(data.is_profile_complete),
            socialConnections: {
              instagram: Boolean(data.instagram_connected),
              tiktok: Boolean(data.tiktok_connected),
              youtube: Boolean(data.youtube_connected),
              linkedin: Boolean(data.linkedin_connected)
            },
            visibilitySettings: {
              showInstagram: data.show_instagram !== false,
              showTiktok: data.show_tiktok !== false,
              showYoutube: data.show_youtube !== false,
              showLinkedin: data.show_linkedin !== false,
              showLocation: data.show_location !== false,
              showAnalytics: data.show_analytics !== false
            },
            audienceLocation: data.audience_location || {
              primary: 'Global',
              secondary: [],
              countries: [
                { name: 'United States', percentage: 30 },
                { name: 'United Kingdom', percentage: 20 },
                { name: 'Canada', percentage: 15 },
                { name: 'Australia', percentage: 10 },
                { name: 'Others', percentage: 25 }
              ]
            }
          };
          setProfile(transformedProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load creator profile',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    // Set up real-time subscription for profile updates
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Profile updated:', payload);
          // Update the profile in the state
          if (payload.new) {
            const data = payload.new;
            const updatedProfile: CreatorProfile = {
              id: data.id,
              firstName: data.first_name || '',
              lastName: data.last_name || '',
              bio: data.bio || '',
              avatarUrl: data.avatar_url,
              bannerUrl: data.banner_url,
              primaryPlatform: data.primary_platform || '',
              contentType: data.content_type || '',
              audienceType: data.audience_type || '',
              followerCount: data.follower_count || '0',
              engagementRate: data.engagement_rate || '0%',
              isProfileComplete: Boolean(data.is_profile_complete),
              socialConnections: {
                instagram: Boolean(data.instagram_connected),
                tiktok: Boolean(data.tiktok_connected),
                youtube: Boolean(data.youtube_connected),
                linkedin: Boolean(data.linkedin_connected)
              },
              visibilitySettings: {
                showInstagram: data.show_instagram !== false,
                showTiktok: data.show_tiktok !== false,
                showYoutube: data.show_youtube !== false,
                showLinkedin: data.show_linkedin !== false,
                showLocation: data.show_location !== false,
                showAnalytics: data.show_analytics !== false
              },
              audienceLocation: data.audience_location || {
                primary: 'Global',
                countries: []
              }
            };
            setProfile(updatedProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  const updateProfile = async (updatedData: Partial<CreatorProfile>) => {
    if (!user?.id || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedData.firstName ?? profile.firstName,
          last_name: updatedData.lastName ?? profile.lastName,
          bio: updatedData.bio ?? profile.bio,
          primary_platform: updatedData.primaryPlatform ?? profile.primaryPlatform,
          content_type: updatedData.contentType ?? profile.contentType,
          audience_type: updatedData.audienceType ?? profile.audienceType,
          is_profile_complete: true,
          audience_location: updatedData.audienceLocation ?? profile.audienceLocation
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });

      // Update local state
      setProfile((prev) => prev ? { ...prev, ...updatedData } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return;

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('creator-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('creator-assets')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: data.publicUrl
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile((prev) => prev ? { ...prev, avatarUrl: data.publicUrl } : null);

      toast({
        title: 'Avatar uploaded',
        description: 'Your profile picture has been updated',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleVisibilitySetting = async (setting: keyof CreatorProfile['visibilitySettings']) => {
    if (!user?.id || !profile) return;

    try {
      // Create an update object with the specific visibility setting
      const updateData: Record<string, boolean> = {};
      
      // Convert camelCase setting to snake_case for database
      const dbField = setting.replace(/([A-Z])/g, "_$1").toLowerCase();
      
      const newValue = !profile.visibilitySettings[setting];
      updateData[dbField] = newValue;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
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

      toast({
        title: 'Visibility updated',
        description: `${setting.replace('show', '')} visibility has been ${newValue ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update visibility settings',
        variant: 'destructive'
      });
    }
  };

  const connectSocialPlatform = async (platform: string) => {
    if (!user?.id || !profile) return;

    // In a real app, this would initiate OAuth flow with the platform
    // For now, we'll simulate connecting by toggling the connected state

    try {
      const platformKey = `${platform}_connected`;
      const isCurrentlyConnected = profile.socialConnections[platform as keyof typeof profile.socialConnections];

      const { error } = await supabase
        .from('profiles')
        .update({ [platformKey]: !isCurrentlyConnected })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
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
        title: isCurrentlyConnected ? 'Disconnected' : 'Connected',
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} successfully ${isCurrentlyConnected ? 'disconnected' : 'connected'}`,
      });
    } catch (error) {
      console.error(`Error toggling ${platform} connection:`, error);
      toast({
        title: 'Error',
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
    connectSocialPlatform
  };
};
