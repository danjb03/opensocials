
import { useMemo } from 'react';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';

export interface CreatorProfile {
  firstName: string | null;
  lastName: string | null;
  primaryPlatform: string | null;
  contentType: string | null;
  isProfileComplete: boolean;
  socialConnections?: {
    instagram?: boolean;
    tiktok?: boolean;
    youtube?: boolean;
    linkedin?: boolean;
  };
}

export const useCreatorProfile = () => {
  const { profile: rawProfile, isLoading } = useCreatorAuth();

  const profile = useMemo((): CreatorProfile | null => {
    if (!rawProfile) return null;

    return {
      firstName: rawProfile.first_name,
      lastName: rawProfile.last_name,
      primaryPlatform: rawProfile.primary_platform,
      contentType: rawProfile.content_types?.[0] || null,
      isProfileComplete: rawProfile.is_profile_complete || false,
      socialConnections: {
        instagram: !!rawProfile.social_handles?.instagram,
        tiktok: !!rawProfile.social_handles?.tiktok,
        youtube: !!rawProfile.social_handles?.youtube,
        linkedin: !!rawProfile.social_handles?.linkedin,
      }
    };
  }, [rawProfile]);

  return {
    profile,
    isLoading
  };
};
