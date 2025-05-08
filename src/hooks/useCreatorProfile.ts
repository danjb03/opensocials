
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { checkOAuthRedirect, fetchPlatformAnalytics } from '@/lib/oauth';
import { submitCreatorProfile } from '@/utils/creatorOnboarding';

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
  // Add the new fields
  industries?: string[];
  creatorType?: string;
}

// Define an extended profile type that includes the custom fields we'll be using
interface ExtendedProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio?: string | null;
  avatar_url: string | null;
  banner_url?: string | null;
  primary_platform?: string | null;
  content_type?: string | null;
  audience_type?: string | null;
  follower_count?: string | null;
  engagement_rate?: string | null;
  is_profile_complete?: boolean | null;
  instagram_connected?: boolean | null;
  tiktok_connected?: boolean | null;
  youtube_connected?: boolean | null;
  linkedin_connected?: boolean | null;
  show_instagram?: boolean | null;
  show_tiktok?: boolean | null;
  show_youtube?: boolean | null;
  show_linkedin?: boolean | null;
  show_location?: boolean | null;
  show_analytics?: boolean | null;
  audience_location?: any | null;
  created_at: string | null;
  updated_at: string | null;
  company_name: string | null;
  industries?: string[] | null;
  creator_type?: string | null;
}

export const useCreatorProfile = () => {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [platformAnalytics, setPlatformAnalytics] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const { toast: uiToast } = useToast();

  // Check if we've returned from an OAuth flow
  useEffect(() => {
    const { connected } = checkOAuthRedirect();
    if (connected) {
      toast.success(`Successfully connected ${connected}!`, {
        description: "Your profile has been updated with your social account."
      });
    }
  }, []);

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
          // Cast the data to our extended profile type
          const profileData = data as unknown as ExtendedProfile;
          
          // Transform data to match our interface
          const transformedProfile: CreatorProfile = {
            id: profileData.id,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            bio: profileData.bio || '',
            avatarUrl: profileData.avatar_url,
            bannerUrl: profileData.banner_url || null,
            primaryPlatform: profileData.primary_platform || '',
            contentType: profileData.content_type || '',
            audienceType: profileData.audience_type || '',
            followerCount: profileData.follower_count || '0',
            engagementRate: profileData.engagement_rate || '0%',
            isProfileComplete: Boolean(profileData.is_profile_complete),
            socialConnections: {
              instagram: Boolean(profileData.instagram_connected),
              tiktok: Boolean(profileData.tiktok_connected),
              youtube: Boolean(profileData.youtube_connected),
              linkedin: Boolean(profileData.linkedin_connected)
            },
            visibilitySettings: {
              showInstagram: profileData.show_instagram !== false,
              showTiktok: profileData.show_tiktok !== false,
              showYoutube: profileData.show_youtube !== false,
              showLinkedin: profileData.show_linkedin !== false,
              showLocation: profileData.show_location !== false,
              showAnalytics: profileData.show_analytics !== false
            },
            audienceLocation: profileData.audience_location || {
              primary: 'Global',
              secondary: [],
              countries: [
                { name: 'United States', percentage: 30 },
                { name: 'United Kingdom', percentage: 20 },
                { name: 'Canada', percentage: 15 },
                { name: 'Australia', percentage: 10 },
                { name: 'Others', percentage: 25 }
              ]
            },
            industries: profileData.industries || [],
            creatorType: profileData.creator_type || ''
          };
          setProfile(transformedProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        uiToast({
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
            const data = payload.new as unknown as ExtendedProfile;
            const updatedProfile: CreatorProfile = {
              id: data.id,
              firstName: data.first_name || '',
              lastName: data.last_name || '',
              bio: data.bio || '',
              avatarUrl: data.avatar_url,
              bannerUrl: data.banner_url || null,
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
              },
              industries: data.industries || [],
              creatorType: data.creator_type || ''
            };
            setProfile(updatedProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, uiToast]);

  // Fetch platform analytics when social connections change
  useEffect(() => {
    if (!profile) return;

    const fetchAnalyticsData = async () => {
      const analytics: Record<string, any> = {};
      
      if (profile.socialConnections.instagram) {
        try {
          analytics.instagram = await fetchPlatformAnalytics('instagram');
        } catch (error) {
          console.error('Error fetching Instagram analytics:', error);
        }
      }
      
      if (profile.socialConnections.tiktok) {
        try {
          analytics.tiktok = await fetchPlatformAnalytics('tiktok');
        } catch (error) {
          console.error('Error fetching TikTok analytics:', error);
        }
      }
      
      if (profile.socialConnections.youtube) {
        try {
          analytics.youtube = await fetchPlatformAnalytics('youtube');
        } catch (error) {
          console.error('Error fetching YouTube analytics:', error);
        }
      }

      setPlatformAnalytics(analytics);
    };

    fetchAnalyticsData();
  }, [profile?.socialConnections]);

  const updateProfile = async (updatedData: Partial<CreatorProfile>) => {
    if (!user?.id || !profile) return;

    try {
      console.log('Profile update requested with data:', updatedData);
      
      // Convert from our frontend model to database model
      const dbUpdateData: Record<string, any> = {
        first_name: updatedData.firstName ?? profile.firstName,
        last_name: updatedData.lastName ?? profile.lastName,
        bio: updatedData.bio ?? profile.bio,
        primary_platform: updatedData.primaryPlatform ?? profile.primaryPlatform,
        content_type: updatedData.contentType ?? profile.contentType,
        audience_type: updatedData.audienceType ?? profile.audienceType,
        is_profile_complete: updatedData.isProfileComplete ?? profile.isProfileComplete
      };

      // Handle audience location specifically to ensure proper JSON storage
      if (updatedData.audienceLocation) {
        dbUpdateData.audience_location = updatedData.audienceLocation;
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

      // If we have industries and creatorType, save those using the specialized function
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

      // Show success message
      toast.success('Profile updated successfully', {
        description: 'Your profile has been updated.'
      });

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      
      // Close edit mode if profile is now complete
      if (updatedData.isProfileComplete) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please try again later.'
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

      uiToast({
        description: 'Your profile picture has been updated',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      uiToast({
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

      uiToast({
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} successfully ${isCurrentlyConnected ? 'disconnected' : 'connected'}`,
      });
    } catch (error) {
      console.error(`Error toggling ${platform} connection:`, error);
      uiToast({
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
